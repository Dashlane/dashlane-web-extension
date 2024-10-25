import {
  AccountAuthenticationType,
  AuthenticationCode,
  CarbonLegacyClient,
  SSOSettingsData,
} from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  getUserPublicSetting,
  storeUserPublicSetting,
} from "Application/ApplicationSettings";
import {
  GhostProfile,
  localSupportedAuthenticationMethod,
  Profile,
  UnsafeProfile,
} from "Session/types";
import {
  enableOtp,
  localDataLoaded,
  storeAccountAuthenticationType,
} from "Session/Store/account/actions";
import { OtpType } from "Session/Store/account/";
import { storeSSOSettings } from "Session/Store/ssoSettings/actions";
import { StoreService } from "Store/index";
import {
  updateisUsingDashlaneAuthenticator,
  updateServerKey,
} from "Session/Store/session/actions";
import { SessionService } from "User/Services/types";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { getDeviceAccessKeySelector } from "Authentication/selectors";
import { getLocalAccounts } from "Authentication";
import {
  ApiError,
  BusinessError,
  completeLoginWithAuthTicket,
  CompleteLoginWithAuthTicketError,
  DeviceDeactivated,
  getAuthenticationMethodsForLogin,
  GetAuthenticationMethodsForLoginError,
  GetAuthenticationMethodsForLoginSuccess,
  InvalidAuthTicket,
  isApiError,
  isApiErrorOfType,
  SSOLoginVerification,
  UserNotFound,
  UserSSOInfoResponse,
  VerificationMethod,
} from "Libs/DashlaneApi";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { HttpError } from "Libs/Http";
import { isCarbonError } from "Libs/Error";
import { wipeOutLocalAccounts } from "UserManagement";
import { StorageService } from "Libs/Storage/types";
import { userLoginSelector } from "Session/selectors";
export async function checkLogin(
  storeService: StoreService,
  storageService: StorageService,
  carbonClient: CarbonLegacyClient
): Promise<AuthenticationCode> {
  const state = storeService.getState();
  const login = userLoginSelector(state);
  let verificationMethods: Array<VerificationMethod> | undefined;
  let accountAuthenticationType: AccountAuthenticationType;
  try {
    const { profiles } = await getLocalProfiles(storeService, storageService);
    const deviceAccessKey = getDeviceAccessKeySelector(state, login);
    if (!deviceAccessKey) {
      throw new Error("Unexpectedly missing deviceAccessKey during login");
    }
    const response = await getAuthenticationMethodsForLogin(storeService, {
      login,
      deviceAccessKey,
      methods: localSupportedAuthenticationMethod,
      ...(profiles.length ? { profiles } : {}),
    });
    if (isApiError(response)) {
      return handleGetAuthenticationMethodsForLoginError(
        storageService,
        carbonClient,
        response,
        login
      );
    }
    void handleDeletedProfiles(storageService, carbonClient, response);
    verificationMethods = response.verifications;
    accountAuthenticationType = response.accountType;
    storeService.dispatch(
      storeAccountAuthenticationType(accountAuthenticationType)
    );
  } catch (error) {
    if (!isCarbonError(error, HttpError)) {
      throw error;
    }
    verificationMethods = getVerificationMethodsFromCachedStatus(login);
  }
  let verificationType;
  const ssoVerificationMethod = verificationMethods.find(
    (verificationMethod) => verificationMethod.type === "sso"
  ) as SSOLoginVerification;
  if (
    ssoVerificationMethod?.ssoInfo.serviceProviderUrl &&
    ssoVerificationMethod?.ssoInfo.migration !== "mp_user_to_sso_member"
  ) {
    verificationType = AuthenticationCode.SSO_LOGIN_BYPASS;
  } else {
    verificationType = getVerificationType(login, verificationMethods);
  }
  cacheIsSso(login, !!ssoVerificationMethod);
  processVerification(
    verificationType,
    storeService,
    ssoVerificationMethod ? ssoVerificationMethod.ssoInfo : undefined,
    accountAuthenticationType
  );
  return verificationType;
}
function getVerificationType(
  login: string,
  verificationMethods: Array<VerificationMethod> = []
): AuthenticationCode {
  const ssoInfos = verificationMethods.find((i) => i.type === "sso") as
    | SSOLoginVerification
    | undefined;
  cacheIsSso(login, !!ssoInfos);
  const otpStatus = inferOtpStatus(verificationMethods);
  cacheOtpStatus(login, otpStatus);
  if (otpStatus === OtpType.OTP_LOGIN) {
    return AuthenticationCode.ASK_OTP;
  }
  if (ssoInfos && ssoInfos.ssoInfo.migration !== "mp_user_to_sso_member") {
    return AuthenticationCode.SSO_LOGIN_BYPASS;
  }
  return AuthenticationCode.ASK_MASTER_PASSWORD;
}
function processVerification(
  authenticationCode: AuthenticationCode,
  storeService: StoreService,
  ssoInfo: UserSSOInfoResponse | undefined,
  accountAuthenticationType: AccountAuthenticationType
) {
  switch (authenticationCode) {
    case AuthenticationCode.SSO_LOGIN_BYPASS:
      if (!ssoInfo?.serviceProviderUrl) {
        throw new Error(
          "[LocalAuthentication] - Unable to use SSO verification. Missing SSO information."
        );
      }
      storeService.dispatch(
        storeSSOSettings({
          ssoUser: true,
          ...getUsersSSOInfo(ssoInfo),
        })
      );
      break;
    case AuthenticationCode.ASK_OTP:
      storeService.dispatch(enableOtp(OtpType.OTP_LOGIN));
      break;
    default:
      break;
  }
  if (authenticationCode !== AuthenticationCode.SSO_LOGIN_BYPASS) {
    storeService.dispatch(
      storeSSOSettings({
        ssoUser: false,
        ...getUsersSSOInfo(ssoInfo),
      })
    );
  }
  storeService.dispatch(
    storeAccountAuthenticationType(accountAuthenticationType)
  );
}
function partitionProfiles(unsafeProfiles: UnsafeProfile[]) {
  const partitionsInit: {
    profiles: Profile[];
    ghostProfiles: GhostProfile[];
  } = {
    profiles: [],
    ghostProfiles: [],
  };
  return unsafeProfiles.reduce((partitions, unsafeProfile) => {
    if (unsafeProfile.login && unsafeProfile.deviceAccessKey) {
      partitions.profiles.push(unsafeProfile);
    } else {
      partitions.ghostProfiles.push(unsafeProfile);
    }
    return partitions;
  }, partitionsInit);
}
export async function getLocalProfiles(
  storeService: StoreService,
  storageService: StorageService
): Promise<{
  profiles: Profile[];
  ghostProfiles: GhostProfile[];
}> {
  const localAccounts = await getLocalAccounts(storeService, storageService);
  const localLogins = localAccounts.map((account) => account.login);
  const unsafeProfiles = localLogins.map((login) => ({
    login,
    deviceAccessKey: getDeviceAccessKeySelector(storeService.getState(), login),
  }));
  return partitionProfiles(unsafeProfiles);
}
export async function handleDeletedProfiles(
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  response: GetAuthenticationMethodsForLoginSuccess
): Promise<void> {
  const { profilesToDelete } = response;
  const hasProfilesToDelete = (profilesToDelete || []).length > 0;
  if (hasProfilesToDelete) {
    return;
  }
  const accountsToDelete = profilesToDelete.map((p) => p.login);
  await wipeOutLocalAccounts(storageService, carbonClient, accountsToDelete);
}
function getCachedOtpStatus(login: string): OtpType.OTP_LOGIN | null {
  const cachedOtpLoginFlag = getUserPublicSetting(login, "otp2");
  return cachedOtpLoginFlag ? OtpType.OTP_LOGIN : null;
}
function getCachedIsSso(login: string): boolean {
  const cachedOtpLoginFlag = getUserPublicSetting(login, "ssoInfos");
  return cachedOtpLoginFlag;
}
export function cacheOtpStatus(login: string, otpStatus: OtpType) {
  storeUserPublicSetting(login, "otp2", otpStatus === OtpType.OTP_LOGIN);
}
export function cacheIsSso(login: string, isSso: boolean) {
  storeUserPublicSetting(login, "ssoInfos", isSso);
}
function getVerificationMethodsFromCachedStatus(
  login: string
): VerificationMethod[] {
  const cachedOtpStatus = getCachedOtpStatus(login);
  const cachedIsSso = getCachedIsSso(login);
  const result = new Array<VerificationMethod>();
  if (cachedOtpStatus === OtpType.OTP_LOGIN) {
    result.push({ type: "totp" });
  }
  if (cachedIsSso) {
    result.push({
      type: "sso",
      ssoInfo: { serviceProviderUrl: "" },
    });
  }
  return result;
}
function inferOtpStatus(
  verificationMethods: VerificationMethod[]
): OtpType.OTP_LOGIN | null {
  const hasTOTP = verificationMethods.some((method) => method.type === "totp");
  if (hasTOTP) {
    return OtpType.OTP_LOGIN;
  }
  const verificationMethodsCleaned = verificationMethods.filter(
    (verification) => verification.type !== "sso"
  );
  if (verificationMethodsCleaned.length > 0) {
    throw new Error("Unsupported 2FA method requested");
  }
  return null;
}
export async function handleGetAuthenticationMethodsForLoginError(
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  error: ApiError<GetAuthenticationMethodsForLoginError>,
  login: string
): Promise<never> {
  if (!isApiErrorOfType(BusinessError, error)) {
    throw new Error(
      `Failed to getAuthenticationMethodsForLogin (${error.code})`
    );
  }
  const code = error.code;
  switch (code) {
    case DeviceDeactivated:
      await wipeOutLocalAccounts(storageService, carbonClient, [login]);
      throw new Error(
        AuthenticationCode[AuthenticationCode.DEVICE_NOT_REGISTERED]
      );
    case UserNotFound:
    case "SSO_BLOCKED":
    case "invalid_authentication":
      throw new Error(
        AuthenticationCode[AuthenticationCode.TEAM_GENERIC_ERROR]
      );
    default:
      assertUnreachable(code);
  }
}
export async function completeLogin(
  storeService: StoreService,
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  authTicket: string,
  withBackupCode: boolean
): Promise<AuthenticationCode> {
  const login = storeService.getUserLogin();
  const deviceAccessKey = getDeviceAccessKeySelector(
    storeService.getState(),
    login
  );
  const params = {
    login,
    deviceAccessKey,
    authTicket,
  };
  const response = await completeLoginWithAuthTicket(storeService, params);
  if (isApiError(response)) {
    return handleCompleteLoginError(
      storageService,
      carbonClient,
      response,
      login
    );
  }
  const { serverKey } = response;
  if (!serverKey) {
    throw new Error(AuthenticationCode[AuthenticationCode.SERVER_KEY_MISSING]);
  }
  storeService.dispatch(updateisUsingDashlaneAuthenticator(withBackupCode));
  storeService.dispatch(updateServerKey(serverKey));
  return AuthenticationCode.ASK_MASTER_PASSWORD;
}
async function handleCompleteLoginError(
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  error: ApiError<CompleteLoginWithAuthTicketError>,
  login: string
): Promise<AuthenticationCode> {
  if (!isApiErrorOfType(BusinessError, error)) {
    throw new Error(`Failed to complete login (${error.code})`);
  }
  const code = error.code;
  switch (code) {
    case "DEVICE_NOT_FOUND":
    case "DEACTIVATED_DEVICE":
      await wipeOutLocalAccounts(storageService, carbonClient, [login]);
      throw new Error(
        AuthenticationCode[AuthenticationCode.DEVICE_NOT_REGISTERED]
      );
    case InvalidAuthTicket:
      throw new Error(AuthenticationCode[AuthenticationCode.TOKEN_NOT_VALID]);
    default:
      assertUnreachable(code);
  }
}
export async function loadLocalData(
  sessionService: SessionService,
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService
): Promise<AuthenticationCode.LOGGEDIN> {
  dataEncryptorService.getInstance().prepareCrypto();
  await sessionService.getInstance().user.loadSessionData();
  storeService.dispatch(localDataLoaded());
  return AuthenticationCode.LOGGEDIN;
}
const getSSOMigrationType = (
  ssoMigrationInfo: UserSSOInfoResponse
): AuthenticationFlowContracts.SSOMigrationType | undefined => {
  if (ssoMigrationInfo.migration) {
    switch (ssoMigrationInfo.migration) {
      case "mp_user_to_sso_member":
        return AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO;
      case "sso_member_to_admin":
        return AuthenticationFlowContracts.SSOMigrationType.SSO_TO_MP;
      case "sso_member_to_mp_user":
        return AuthenticationFlowContracts.SSOMigrationType.SSO_TO_MP;
      default:
        break;
    }
  }
  return undefined;
};
export const getUsersSSOInfo = (
  ssoInfoResponse?: UserSSOInfoResponse
): Partial<SSOSettingsData> => {
  if (!ssoInfoResponse) {
    return {
      serviceProviderUrl: "",
    };
  }
  const migrationType = getSSOMigrationType(ssoInfoResponse);
  return {
    serviceProviderUrl: ssoInfoResponse.serviceProviderUrl
      ? ssoInfoResponse.serviceProviderUrl
      : "",
    ...(migrationType !== undefined ? { migration: migrationType } : {}),
    isNitroProvider: ssoInfoResponse.isNitroProvider,
  };
};
