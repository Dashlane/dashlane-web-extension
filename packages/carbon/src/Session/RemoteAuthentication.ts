import { v4 as uuidv4 } from "uuid";
import { isEmpty } from "ramda";
import {
  AccountAuthenticationType,
  AuthenticationCode,
  RegisterDeviceData,
  SSOSettingsData,
  VerificationToken,
} from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  CancelDashlaneAuthenticatorRegistration,
  extractExtraDeviceToken,
  PersistData,
  remoteSupportedAuthenticationMethod,
} from "Session/types";
import Debugger from "Logs/Debugger";
import * as settingsActions from "Session/Store/localSettings/actions";
import { OtpType } from "Session/Store/account/";
import {
  confirmUserAuthentication,
  enableOtp,
  storeAccountAuthenticationType,
} from "Session/Store/account/actions";
import * as Backup from "Libs/Backup";
import * as BackupCrypt from "Libs/Backup/BackupCrypt";
import { applyTransactions } from "./Store/actions";
import { StoreService } from "Store/index";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import {
  arrayBufferToText,
  base64ToBuffer,
} from "Libs/CryptoCenter/Helpers/Helper";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { getEncryptionKeyBuffer } from "Libs/CryptoCenter/Helpers/encryptionKeys";
import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
import {
  updateDeviceAnalyticsId,
  updateisUsingBackupCode,
  updateisUsingDashlaneAuthenticator,
  updateMasterPassword,
  updatePublicUserId,
  updateRemoteKey,
  updateServerKey,
  updateSettingsForMPValidation,
  updateUserAnalyticsId,
} from "Session/Store/session/actions";
import { WSService } from "Libs/WS/index";
import { device as deviceUtil } from "@dashlane/browser-utils";
import { storeSSOSettings } from "Session/Store/ssoSettings/actions";
import {
  deviceRegistered,
  makeDeviceRegistrationKeys,
} from "Authentication/Store/actions";
export { SendTokenStatus } from "Libs/WS/Authentication";
import { SyncAnnouncementTypes } from "Libs/Backup/Probe";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { secureDeviceName } from "Device/secure-device-name";
import {
  convertTokenToAuthTicket,
  dashlaneAuthenticatorGetAuthTicket,
} from "Session/performValidation";
import { masterPasswordValidationDataSelector } from "Session/selectors";
import {
  ApiError,
  BusinessError,
  completeDeviceRegistrationWithAuthTicket,
  CompleteDeviceRegistrationWithAuthTicketError,
  CompleteDeviceRegistrationWithAuthTicketResponse,
  completeExtraDeviceRegistrationWithToken,
  CompleteExtraDeviceRegistrationWithTokenError,
  CompleteExtraDeviceRegistrationWithTokenResponse,
  getAuthenticationMethodsForDevice,
  GetAuthenticationMethodsForDeviceError,
  InvalidAuthTicket,
  isApiError,
  isApiErrorOfType,
  makeSafeCountry,
  makeSafeLanguage,
  requestEmailTokenVerification,
  SSOBlocked,
  SSOLoginVerification,
  TeamGenericError,
  UserNotFound,
  UserSSOInfoResponse,
  VerificationFailed,
  VerificationMethod,
  VerificationMethodDisabled,
} from "Libs/DashlaneApi";
import { sendExceptionLog } from "Logs/Exception";
import { CarbonError } from "Libs/Error";
let cancelDashlaneAuthenticatorPromiseResolve: (
  value: CancelDashlaneAuthenticatorRegistration
) => void | undefined;
let cancelDashlaneAuthenticatorPromiseReject: (
  value: CancelDashlaneAuthenticatorRegistration
) => void | undefined;
export async function requestDeviceRegistration(
  storeService: StoreService
): Promise<AuthenticationCode> {
  const login = storeService.getAccountInfo().login;
  const response = await getAuthenticationMethodsForDevice(storeService, {
    login,
    methods: remoteSupportedAuthenticationMethod,
  });
  if (isApiError(response)) {
    return handleGetAuthenticationMethodsForDeviceError(response);
  }
  const { verifications, accountType } = response;
  if (!verifications) {
    throw new Error(
      "[requestDeviceRegistration] - No verification in API response."
    );
  }
  let verificationType;
  const ssoVerificationMethod = verifications.find(
    (verificationMethod) => verificationMethod.type === "sso"
  ) as SSOLoginVerification;
  if (
    ssoVerificationMethod?.ssoInfo.serviceProviderUrl &&
    ssoVerificationMethod?.ssoInfo.migration !== "mp_user_to_sso_member"
  ) {
    verificationType = AuthenticationCode.SSO_LOGIN_BYPASS;
  } else {
    verificationType = getVerificationType(verifications);
  }
  processVerification(
    verificationType,
    storeService,
    ssoVerificationMethod ? ssoVerificationMethod.ssoInfo : undefined,
    accountType
  );
  return verificationType;
}
function getVerificationType(
  verificationMethods: Array<VerificationMethod> = []
): AuthenticationCode {
  if (verificationMethods.some(({ type }) => type === "email_token")) {
    return AuthenticationCode.ASK_TOKEN;
  }
  if (verificationMethods.some(({ type }) => type === "totp")) {
    return AuthenticationCode.ASK_OTP_FOR_NEW_DEVICE;
  }
  if (
    verificationMethods.some(({ type }) => type === "dashlane_authenticator")
  ) {
    return AuthenticationCode.ASK_DASHLANE_AUTHENTICATOR;
  }
  throw new Error(
    "[requestDeviceRegistration - getVerificationType] - Verification not supported!"
  );
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
          "[requestDeviceRegistration - processVerification] - Unable to use SSO verification. Missing SSO information."
        );
      }
      storeService.dispatch(
        storeSSOSettings({
          ssoUser: true,
          ...getUsersSSOInfo(ssoInfo),
        })
      );
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
function handleGetAuthenticationMethodsForDeviceError(
  error: ApiError<GetAuthenticationMethodsForDeviceError>
): never {
  if (!isApiErrorOfType(BusinessError, error)) {
    throw new Error(
      `Failed to getAuthenticationMethodsForDevice (${error.code})`
    );
  }
  const code = error.code;
  switch (code) {
    case UserNotFound:
      throw new Error(AuthenticationCode[AuthenticationCode.USER_DOESNT_EXIST]);
    case SSOBlocked:
      throw new Error(AuthenticationCode[AuthenticationCode.SSO_BLOCKED]);
    case TeamGenericError:
    case "expired_version":
      throw new Error(
        AuthenticationCode[AuthenticationCode.TEAM_GENERIC_ERROR]
      );
    case "DEACTIVATED_USER":
      throw new Error("Unsupported DEACTIVATED_USER");
    default:
      assertUnreachable(code);
  }
}
export async function checkLoginWithUki(
  storeService: StoreService,
  wsService: WSService,
  uki: string
): Promise<AuthenticationCode> {
  const login = storeService.getAccountInfo().login;
  const isValid = await isUkiValid(wsService, login, uki);
  if (!isValid) {
    throw new Error(AuthenticationCode[AuthenticationCode.INVALID_UKI]);
  }
  storeService.dispatch(confirmUserAuthentication());
  return Promise.resolve(AuthenticationCode.USE_LOCAL_UKI);
}
async function isUkiValid(
  wsService: WSService,
  login: string,
  uki: string
): Promise<boolean> {
  const response = await wsService.authentication.validity({ login, uki });
  return response === "UKI VALID";
}
export async function askServerToSendToken(
  storeService: StoreService,
  login: string
): Promise<void> {
  const response = await requestEmailTokenVerification(storeService, {
    login,
  });
  if (isApiError(response)) {
    Debugger.log(
      `Server failed to send a token with response: ${response.message}`
    );
    throw new Error(AuthenticationCode[AuthenticationCode.SEND_TOKEN_FAILED]);
  }
}
const inferOTPStatus = (
  storeService: StoreService,
  serverKey: string | undefined
) => {
  if (serverKey) {
    storeService.dispatch(enableOtp(OtpType.OTP_LOGIN));
  } else {
    storeService.dispatch(enableOtp(OtpType.OTP_NEW_DEVICE));
  }
};
export function generateUki(deviceId: string) {
  return `${deviceId}-${uuidv4()}`;
}
type CompleteDeviceRegistrationResponse =
  | (CompleteExtraDeviceRegistrationWithTokenResponse & {
      ssoServerKey: null;
    })
  | CompleteDeviceRegistrationWithAuthTicketResponse;
const completeDeviceRegistrationToken = async (
  storeService: StoreService,
  verificationToken: VerificationToken,
  isDataPersisted: PersistData,
  authTicket: string,
  login: string,
  deviceName?: string
): Promise<CompleteDeviceRegistrationResponse> => {
  const unsecureDeviceName = deviceName || deviceUtil.getDefaultDeviceName();
  const platformInfo = storeService.getPlatformInfo();
  const securedDeviceName = secureDeviceName(unsecureDeviceName);
  if (platformInfo.platformName === "server_carbon_unknown") {
    throw new Error("Unexpected uninitialized platform info");
  }
  const device = {
    deviceName: securedDeviceName,
    appVersion: platformInfo.appVersion,
    platform: platformInfo.platformName,
    osCountry: makeSafeCountry(
      storeService.getLocation().country || platformInfo.country
    ),
    osLanguage: makeSafeLanguage(platformInfo.lang),
    temporary: isDataPersisted !== PersistData.PERSIST_DATA_YES,
  };
  switch (verificationToken.type) {
    case "extraDeviceToken":
      return {
        ...(await completeExtraDeviceRegistrationWithToken(storeService, {
          device,
          login,
          verification: {
            token: extractExtraDeviceToken(verificationToken),
          },
        })),
        ssoServerKey: null,
      };
    case "emailToken":
    case "otp":
    case "sso":
      return completeDeviceRegistrationWithAuthTicket(storeService, {
        device,
        login,
        authTicket,
      });
    default:
      assertUnreachable(verificationToken);
  }
};
const completeDeviceRegistrationDashlaneAuthenticator = (
  storeService: StoreService,
  isDataPersisted: PersistData,
  authTicket: string,
  deviceName?: string
): Promise<CompleteDeviceRegistrationWithAuthTicketResponse> => {
  const unsecureDeviceName = deviceName || deviceUtil.getDefaultDeviceName();
  const platformInfo = storeService.getPlatformInfo();
  const login = storeService.getAccountInfo().login;
  const securedDeviceName = secureDeviceName(unsecureDeviceName);
  if (platformInfo.platformName === "server_carbon_unknown") {
    throw new Error("Unexpected unitiliazed platform info");
  }
  const device = {
    deviceName: securedDeviceName,
    appVersion: platformInfo.appVersion,
    platform: platformInfo.platformName,
    osCountry: makeSafeCountry(
      storeService.getLocation().country || platformInfo.country
    ),
    osLanguage: makeSafeLanguage(platformInfo.lang),
    temporary: isDataPersisted !== PersistData.PERSIST_DATA_YES,
  };
  return completeDeviceRegistrationWithAuthTicket(storeService, {
    device,
    login,
    authTicket,
  });
};
const getAuthTicketFromDashlaneAuthenticator = async (
  storeService: StoreService,
  deviceName?: string
): Promise<string> => {
  const authTicketResponse = await dashlaneAuthenticatorGetAuthTicket(
    storeService,
    deviceName
  );
  if (authTicketResponse.success === false) {
    const {
      error: { code, message },
    } = authTicketResponse;
    if (code === AuthenticationCode.BUSINESS_ERROR) {
      throw new Error(message);
    }
    throw new Error(AuthenticationCode[code]);
  }
  cancelDashlaneAuthenticatorPromiseResolve?.(
    CancelDashlaneAuthenticatorRegistration.COMPLETED
  );
  return authTicketResponse.authTicket;
};
export function cancelRegistrationWithDashlaneAuthenticator() {
  cancelDashlaneAuthenticatorPromiseReject?.(
    CancelDashlaneAuthenticatorRegistration.CANCELLED
  );
}
export async function registerDeviceWithDashlaneAuthenticator(
  storeService: StoreService,
  isDataPersisted: PersistData,
  login: string,
  deviceName?: string
): Promise<
  | AuthenticationCode.ASK_MASTER_PASSWORD
  | AuthenticationCode.DASHLANE_AUTHENTICATOR_LOGIN_CANCELLED
> {
  const cancelDashlaneAuthenticator = new Promise((resolve, reject) => {
    cancelDashlaneAuthenticatorPromiseResolve = resolve;
    cancelDashlaneAuthenticatorPromiseReject = reject;
  });
  let authTicket;
  try {
    const promises = await Promise.all([
      getAuthTicketFromDashlaneAuthenticator(storeService, deviceName),
      cancelDashlaneAuthenticator,
    ]);
    authTicket = promises[0];
  } catch (error) {
    if (error === CancelDashlaneAuthenticatorRegistration.CANCELLED) {
      return AuthenticationCode.DASHLANE_AUTHENTICATOR_LOGIN_CANCELLED;
    }
    throw error;
  } finally {
    cancelDashlaneAuthenticatorPromiseReject = undefined;
    cancelDashlaneAuthenticatorPromiseResolve = undefined;
  }
  if (authTicket) {
    const response = await completeDeviceRegistrationDashlaneAuthenticator(
      storeService,
      isDataPersisted,
      authTicket,
      deviceName
    );
    if (isApiError(response)) {
      handleCompleteDeviceRegistrationWithDashlaneAuthenticatorError(response);
    }
    storeService.dispatch(updateisUsingDashlaneAuthenticator(true));
    storeService.dispatch(updateisUsingBackupCode(false));
    const {
      deviceAccessKey,
      deviceSecretKey,
      settings,
      serverKey,
      deviceAnalyticsId,
      userAnalyticsId,
      publicUserId,
    } = response;
    registerDevice(storeService, {
      login,
      deviceAccessKey,
      deviceSecretKey,
      settings,
      serverKey,
      deviceAnalyticsId,
      userAnalyticsId,
      publicUserId,
      isDataPersisted,
    });
    return AuthenticationCode.ASK_MASTER_PASSWORD;
  } else {
    throw new Error("Authentication Ticket is missing");
  }
}
const getAuthTicketFromToken = async (
  storeService: StoreService,
  verificationToken: VerificationToken
): Promise<string> => {
  const authTicketResponse = await convertTokenToAuthTicket(
    storeService,
    verificationToken
  );
  if (authTicketResponse.success === false) {
    const {
      error: { code, message },
    } = authTicketResponse;
    if (code === AuthenticationCode.BUSINESS_ERROR) {
      throw new Error(message);
    }
    throw new Error(AuthenticationCode[code]);
  }
  return authTicketResponse.authTicket;
};
export async function registerDeviceWithToken(
  storeService: StoreService,
  isDataPersisted: PersistData,
  verificationToken: VerificationToken,
  withBackupCode: boolean,
  login: string,
  deviceName?: string,
  ssoOptions?: {
    masterPasswordEncryptorService: DataEncryptorService;
    remoteDataEncryptorService: DataEncryptorService;
    ssoServiceProviderKey: string;
  }
): Promise<AuthenticationCode.ASK_MASTER_PASSWORD> {
  const authTicket = await getAuthTicketFromToken(
    storeService,
    verificationToken
  );
  const response = await completeDeviceRegistrationToken(
    storeService,
    verificationToken,
    isDataPersisted,
    authTicket,
    login,
    deviceName
  );
  if (isApiError(response)) {
    return handleCompleteDeviceRegistrationError(response, verificationToken);
  }
  const {
    deviceAccessKey,
    deviceSecretKey,
    settings,
    serverKey,
    ssoServerKey,
    remoteKeys,
    deviceAnalyticsId,
    userAnalyticsId,
    publicUserId,
  } = response;
  if (ssoServerKey) {
    const {
      masterPasswordEncryptorService,
      remoteDataEncryptorService,
      ssoServiceProviderKey,
    } = ssoOptions;
    if (!remoteKeys || isEmpty(remoteKeys)) {
      throw new Error(
        "registerDevice failed with error: ssoServerKey or remoteKeys is missing"
      );
    }
    const serverKeyBuffer = base64ToBuffer(ssoServerKey);
    const remoteKey = remoteKeys.filter((key) => key.type === "sso")[0];
    try {
      const ssoKeyBuffer = base64ToBuffer(ssoServiceProviderKey);
      const encryptionKeyBuffer = getEncryptionKeyBuffer(
        ssoKeyBuffer,
        serverKeyBuffer,
        { skipDerivation: true }
      );
      const encryptionKeyRaw = arrayBufferToText(encryptionKeyBuffer);
      const emptyServerKey = "";
      const cryptoConfig = getNoDerivationCryptoConfig();
      storeService.dispatch(updateMasterPassword(encryptionKeyRaw));
      masterPasswordEncryptorService.setInstance(
        { raw: encryptionKeyRaw },
        emptyServerKey,
        cryptoConfig
      );
      const bytes = await masterPasswordEncryptorService
        .getInstance()
        .decrypt(remoteKey.key);
      const remoteKeyRaw = deflatedUtf8ToUtf16(bytes, {
        skipUtf8Decoding: true,
        skipInflate: true,
      });
      remoteDataEncryptorService.setInstance(
        { raw: remoteKeyRaw },
        emptyServerKey,
        cryptoConfig
      );
      storeService.dispatch(updateRemoteKey(remoteKeyRaw));
    } catch (error) {
      throw new Error(
        `registerDevice failed deciphering remoteKey with error: ${error}`
      );
    }
  }
  storeService.dispatch(updateisUsingDashlaneAuthenticator(false));
  storeService.dispatch(updateisUsingBackupCode(withBackupCode));
  if (verificationToken?.type === "otp") {
    inferOTPStatus(storeService, serverKey);
  }
  registerDevice(storeService, {
    deviceAccessKey,
    deviceSecretKey,
    settings,
    serverKey,
    deviceAnalyticsId,
    userAnalyticsId,
    publicUserId,
    isDataPersisted,
    login,
  });
  return AuthenticationCode.ASK_MASTER_PASSWORD;
}
export async function registerDevice(
  storeService: StoreService,
  deviceData: RegisterDeviceData
) {
  const {
    deviceAccessKey,
    deviceSecretKey,
    settings,
    serverKey,
    deviceAnalyticsId,
    userAnalyticsId,
    publicUserId,
    isDataPersisted,
    deviceName,
    login,
  } = deviceData;
  storeService.dispatch(
    deviceRegistered(
      makeDeviceRegistrationKeys(deviceAccessKey, deviceSecretKey),
      isDataPersisted,
      login
    )
  );
  if (serverKey) {
    storeService.dispatch(updateServerKey(serverKey));
  }
  storeService.dispatch(updateSettingsForMPValidation(settings));
  if (deviceAnalyticsId) {
    storeService.dispatch(updateDeviceAnalyticsId(deviceAnalyticsId));
  }
  if (userAnalyticsId) {
    storeService.dispatch(updateUserAnalyticsId(userAnalyticsId));
  }
  if (publicUserId) {
    storeService.dispatch(updatePublicUserId(publicUserId));
  }
  if (deviceName) {
    const securedDeviceName = secureDeviceName(deviceName);
    storeService.dispatch(
      settingsActions.registerDeviceName(securedDeviceName)
    );
  }
  storeService.dispatch(
    deviceRegistered(
      makeDeviceRegistrationKeys(deviceAccessKey, deviceSecretKey),
      isDataPersisted,
      login
    )
  );
}
type CompleteDeviceRegistrationError =
  | CompleteExtraDeviceRegistrationWithTokenError
  | CompleteDeviceRegistrationWithAuthTicketError;
function handleCompleteDeviceRegistrationError(
  error: ApiError<CompleteDeviceRegistrationError>,
  verificationToken: VerificationToken
): never {
  if (!isApiErrorOfType(BusinessError, error)) {
    throw new Error(`Failed to complete device registration (${error.code})`);
  }
  const code = error.code;
  switch (code) {
    case UserNotFound:
      throw new Error(AuthenticationCode[AuthenticationCode.INVALID_LOGIN]);
    case VerificationFailed:
    case InvalidAuthTicket:
      if (verificationToken.type === "otp") {
        throw new Error(AuthenticationCode[AuthenticationCode.OTP_NOT_VALID]);
      }
      throw new Error(AuthenticationCode[AuthenticationCode.TOKEN_NOT_VALID]);
    case VerificationMethodDisabled:
      throw new Error(
        AuthenticationCode[AuthenticationCode.REGISTER_DEVICE_FAILED]
      );
    case "TEMPORARY_DEVICE_FORBIDDEN":
      throw new Error(
        AuthenticationCode[AuthenticationCode.TEAM_GENERIC_ERROR]
      );
    default:
      assertUnreachable(code);
  }
}
function handleCompleteDeviceRegistrationWithDashlaneAuthenticatorError(
  error: ApiError<CompleteDeviceRegistrationWithAuthTicketError>
): never {
  if (!isApiErrorOfType(BusinessError, error)) {
    throw new Error(`Failed to complete device registration (${error.code})`);
  }
  const code = error.code;
  switch (code) {
    case InvalidAuthTicket:
      throw new Error(
        AuthenticationCode[
          AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED
        ]
      );
    default:
      assertUnreachable(code);
  }
}
export async function validateMasterPassword(
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService
): Promise<AuthenticationCode.LOGGEDIN> {
  try {
    const state = storeService.getState();
    const settings = masterPasswordValidationDataSelector(state);
    const announce = (_: SyncAnnouncementTypes) => {};
    const [clearSettingsTransaction] = await BackupCrypt.decrypt(
      dataEncryptorService.getInstance(),
      announce,
      null,
      new Map<string, number>(),
      [settings]
    );
    storeService.dispatch(applyTransactions([clearSettingsTransaction]));
    storeService.dispatch(
      settingsActions.registerLastSync(Backup.MIN_SYNC_TIMESTAMP)
    );
    return AuthenticationCode.LOGGEDIN;
  } catch (error) {
    const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
      "REMOTE LOGIN",
      "validateMasterPassword"
    );
    void sendExceptionLog({ error: augmentedError });
    throw new Error(AuthenticationCode[AuthenticationCode.WRONG_PASSWORD]);
  }
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
