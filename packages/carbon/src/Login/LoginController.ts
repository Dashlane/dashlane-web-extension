import { Trigger, VerificationMode } from "@dashlane/hermes";
import {
  AccountAuthenticationType,
  type AdminPermissionLevel,
  AuthenticationCode,
  CarbonLegacyClient,
  LoginResultEnum,
  LoginStep,
  type LoginType,
  possibleAdminPermissions,
  type RememberMeType,
} from "@dashlane/communication";
import { sendLocalAccounts } from "Session/SessionCommunication";
import { StoreService } from "Store/index";
import * as RemoteAuthentication from "Session/RemoteAuthentication";
import { convertTokenToAuthTicket } from "Session/performValidation";
import * as LocalAuthentication from "Session/LocalAuthentication";
import * as SessionCommunication from "Session/SessionCommunication";
import { SessionService, UserSessionService } from "User/Services/types";
import {
  rememberMasterPasswordUpdated,
  shouldRememberMeForSSOUpdated,
  updateIsLocalKeyMigrationRequired,
  updateisUsingBackupCode,
  updateLastMasterPasswordCheck,
  updateLocalKey,
  updateMasterPassword,
  updateServerKey,
  updateSessionDidOpen,
} from "Session/Store/session/actions";
import { OtpType } from "Session/Store/account/index";
import {
  confirmUserAuthentication,
  storeAccountAuthenticationType,
  userAuthenticationFailed,
} from "Session/Store/account/actions";
import { storeUserPublicSetting } from "Application/ApplicationSettings/index";
import {
  localSupportedAuthenticationMethod,
  makeEmailToken,
  makeOTP,
  PersistData,
} from "Session/types";
import { getAndTriggerRefreshAccountInfo } from "Session/SessionController";
import {
  registerDeviceName,
  registerLastSync,
} from "Session/Store/localSettings/actions";
import { isValidLogin, normalizeEmail } from "Utils/index";
import { WSService } from "Libs/WS/index";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { generateLocalkeyAndSetupEncryptorService } from "Libs/CryptoCenter/Helpers/encryptionKeys";
import { DeviceKeys } from "Store/helpers/Device/index";
import { secureDeviceName } from "Device/secure-device-name";
import {
  getDeviceAccessKeySelector,
  ukiSelector,
} from "Authentication/selectors";
import { changeMPinProgressSelector } from "ChangeMasterPassword/selector";
import {
  deviceRegistered,
  makeDeviceRegistrationKeys,
} from "Authentication/Store";
import { getLocalAccounts } from "Authentication/Services/get-local-accounts";
import { refreshTwoFactorAuthenticationInfoService } from "Authentication/TwoFactorAuthentication/services/refresh-two-factor-authentication-service";
import { StorageService } from "Libs/Storage/types";
import { deleteAllLocalUserData } from "Libs/Storage/User";
import {
  sendAskAuthenticationEventLog,
  sendAskSSOAuthenticationEventLog,
  sendDashlaneAuthenticatorErrorLog,
  sendEmailTokenErrorLog,
  sendLoginSuccessEventLog,
  sendMasterPasswordLoginErrorLog,
  sendOTPErrorLog,
  sendOTPForNewDeviceErrorLog,
} from "Login/helpers/logs";
import {
  DashlaneAuthenticatorErrorCode,
  SessionDidOpenOptions,
  TokenOrOTPErrorCode,
} from "Login/types";
import { CoreServices } from "Services";
import {
  isLocalKeyMigrationRequiredSelector,
  isRemoteKeyActivatedSelector,
  nodePremiumStatusSelector,
  userLoginSelector,
} from "Session/selectors";
import {
  ssoMigrationInfoSelector,
  ssoProviderInfoSelector,
  ssoSettingsSelector,
} from "Session/sso.selectors";
import { recoveryInProgressSelector } from "Session/recovery.selectors";
import { hasTACAccessInCurrentSpace } from "Store/helpers/spaceData/index";
import {
  getLocalAccountRememberMeType,
  persistLocalAccountRememberMeType,
} from "Libs/RememberMe/helpers";
import { storeSSOSettings } from "Session/Store/ssoSettings/actions";
import { persistLocalUsersAuthenticationData } from "Authentication/Storage/localUsers";
import { LoginServices } from "Login/dependencies";
import { pairingIdSelector } from "Session/Pairing/pairing.selectors";
import {
  attemptGetDeviceLimitStatus,
  getDeviceLimitStatus,
  startDeviceLimitFlow,
} from "Login/DeviceLimit/device-limit.app-services";
import { triggerServiceProviderUrlRedirect } from "./SSO/utils";
import {
  updateLoginStepInfoLogin,
  updateLoginStepInfoStep,
} from "LoginStepInfo/Store/actions";
import {
  getAuthenticationMethodsForLogin,
  isApiError,
  requestAccountCreation,
  RequestAccountCreationResponse,
  requestEmailTokenVerification,
} from "Libs/DashlaneApi";
import { setRememberMeTypeAction } from "Authentication/Store/currentUser/actions";
import { accountAuthenticationTypeSelector } from "Session/Store/account/selector";
import { firstValueFrom } from "rxjs";
import { isSuccess } from "@dashlane/framework-types";
import { disableAutologin } from "Authentication/Services/disable-autologin";
import { validateLoginForAccountCreation } from "Account/Creation/AccountCreationController";
export interface LoginController {
  openSession: (
    login: string,
    options?: {
      password?: string;
    }
  ) => Promise<LoginResultEnum>;
  openSessionResendToken: (login: string) => Promise<void>;
  openSessionWithToken: (
    login: string,
    password: string,
    token: string,
    isDataPersisted: PersistData,
    deviceName?: string,
    withBackupCode?: boolean
  ) => Promise<LoginResultEnum>;
  openSessionWithDashlaneAuthenticator: (
    login: string,
    password: string,
    isDataPersisted: PersistData,
    deviceName?: string
  ) => Promise<LoginResultEnum>;
  cancelDashlaneAuthenticatorRegistration: () => Promise<void>;
  openSessionWithOTP: (
    login: string,
    password: string,
    otp: string,
    isDataPersisted?: PersistData,
    withBackupCode?: boolean
  ) => Promise<LoginResultEnum>;
  openSessionWithOTPForNewDevice: (
    login: string,
    password: string,
    otp: string,
    isDataPersisted: PersistData,
    deviceName?: string,
    withBackupCode?: boolean
  ) => Promise<LoginResultEnum>;
  openSessionWithMasterPassword: (
    login: string,
    password: string,
    options?: {
      rememberMasterPassword?: boolean;
      triggeredByRememberMeType?: RememberMeType;
      isWebAuthnAuthenticatorRoaming?: boolean;
      isDataPersisted?: PersistData;
      requiredPermissions?: AdminPermissionLevel;
      serverKey?: string;
      loginType: LoginType;
    }
  ) => Promise<LoginResultEnum>;
  loadAccountCreationInfos: (
    login: string,
    password: string,
    deviceName: string,
    deviceKeys: DeviceKeys,
    lastSyncTimestamp: number,
    isDataPersisted: PersistData
  ) => Promise<void>;
}
export const makeLoginController = (
  services: LoginServices
): LoginController => {
  const controller: LoginController = {
    openSession: (
      login: string,
      options?: {
        password?: string;
      }
    ) => {
      return openSession(services, login, options);
    },
    openSessionWithToken: (
      login: string,
      password: string,
      token: string,
      isDataPersisted: PersistData,
      deviceName?: string
    ) => {
      return openSessionWithToken(
        services,
        login,
        password,
        token,
        isDataPersisted,
        deviceName
      );
    },
    openSessionWithDashlaneAuthenticator: (
      login: string,
      password: string,
      isDataPersisted: PersistData,
      deviceName?: string
    ) => {
      return openSessionWithDashlaneAuthenticator(
        services,
        login,
        password,
        isDataPersisted,
        deviceName
      );
    },
    cancelDashlaneAuthenticatorRegistration: () => {
      RemoteAuthentication.cancelRegistrationWithDashlaneAuthenticator();
      return Promise.resolve();
    },
    openSessionWithOTP: (
      login: string,
      password: string,
      otp: string,
      isDataPersisted?: PersistData,
      withBackupCode?: boolean
    ) => {
      return openSessionWithOTP(
        services,
        login,
        password,
        otp,
        isDataPersisted,
        withBackupCode
      );
    },
    openSessionWithOTPForNewDevice: (
      login: string,
      password: string,
      otp: string,
      isDataPersisted: PersistData,
      deviceName?: string,
      withBackupCode?: boolean
    ) => {
      return openSessionWithOTPForNewDevice(
        services,
        login,
        password,
        otp,
        isDataPersisted,
        deviceName,
        withBackupCode
      );
    },
    openSessionWithMasterPassword: (
      login: string,
      password: string,
      options?: {
        rememberMasterPassword?: boolean;
        triggeredByRememberMeType?: RememberMeType;
        isWebAuthnAuthenticatorRoaming?: boolean;
        isDataPersisted?: PersistData;
        requiredPermissions?: AdminPermissionLevel;
        serverKey?: string;
        isSsoLogin?: boolean;
        loginType: LoginType;
      }
    ) => {
      return openSessionWithMasterPassword(services, login, password, options);
    },
    openSessionResendToken: (login: string) => {
      return openSessionResendToken(services.storeService, login);
    },
    loadAccountCreationInfos: (
      login: string,
      password: string,
      deviceName: string,
      deviceKeys: DeviceKeys,
      lastSyncTimestamp: number,
      isDataPersisted: PersistData
    ) => {
      return loadAccountCreationInfos(
        services,
        login,
        password,
        deviceName,
        deviceKeys,
        lastSyncTimestamp,
        isDataPersisted
      );
    },
  };
  return controller;
};
async function openSessionResendToken(
  storeService: StoreService,
  login: string
): Promise<void> {
  await RemoteAuthentication.askServerToSendToken(storeService, login);
  SessionCommunication.triggerOpenSessionTokenSent({
    isResendAction: true,
    login,
  });
}
async function openSession(
  loginServices: LoginServices,
  login: string,
  options?: {
    password?: string;
  }
): Promise<LoginResultEnum> {
  const {
    storeService,
    sessionService,
    wsService,
    storageService,
    moduleClients,
  } = loginServices;
  login = normalizeEmail(login);
  try {
    const password = options && options.password;
    await updateSessionUponLoginAction(loginServices, login, password, {
      authorizeDifferentLogin: DifferentLoginAuthorized.AUTHORIZED,
    });
    let accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    const authenticationCode = await checkLogin(
      storeService,
      storageService,
      moduleClients["carbon-legacy"],
      wsService,
      accountExistLocally
    );
    const accountAuthenticationType = accountAuthenticationTypeSelector(
      storeService.getState()
    );
    if (accountAuthenticationType === "invisibleMasterPassword") {
      SessionCommunication.triggerOpenSessionMasterPasswordLess();
      return LoginResultEnum.MasterPasswordLess;
    }
    switch (authenticationCode) {
      case AuthenticationCode.SSO_LOGIN_BYPASS:
        void sendAskSSOAuthenticationEventLog(
          loginServices,
          VerificationMode.None
        );
        SessionCommunication.triggerOpenSessionSsoRedirectionToIdpRequired(
          triggerServiceProviderUrlRedirect(storeService.getState(), login),
          ssoProviderInfoSelector(storeService.getState()).isNitroProvider
        );
        return LoginResultEnum.SSOLogin;
      case AuthenticationCode.ASK_MASTER_PASSWORD:
        if (!accountExistLocally) {
          throw new Error(
            "checkLogin should never return ASK_MASTER_PASSWORD for remote accounts"
          );
        }
        if (password) {
          return openSessionWithMasterPassword(loginServices, login, password);
        }
        void sendAskAuthenticationEventLog(
          loginServices,
          VerificationMode.None
        );
        storeService.dispatch(updateLoginStepInfoStep(LoginStep.Password));
        SessionCommunication.triggerAskMasterPassword(login);
        return LoginResultEnum.MasterPasswordMissing;
      case AuthenticationCode.ASK_OTP:
        void sendAskAuthenticationEventLog(
          loginServices,
          VerificationMode.Otp2
        );
        storeService.dispatch(updateLoginStepInfoStep(LoginStep.OTP2));
        SessionCommunication.triggerOpenSessionOTPSent({
          hasU2F: false,
        });
        return LoginResultEnum.OTPMissing;
      case AuthenticationCode.ASK_OTP_FOR_NEW_DEVICE:
        const { otpType } = storeService.getAccountInfo();
        void sendAskAuthenticationEventLog(
          loginServices,
          otpType === OtpType.OTP_NEW_DEVICE
            ? VerificationMode.Otp1
            : VerificationMode.Otp2
        );
        storeService.dispatch(updateLoginStepInfoStep(LoginStep.OTP1));
        SessionCommunication.triggerOpenSessionOTPForNewDeviceRequired();
        return LoginResultEnum.OTPMissing;
      case AuthenticationCode.ASK_TOKEN:
        accountExistLocally = await sessionService
          .getInstance()
          .user.accountExistsLocally();
        if (accountExistLocally) {
          throw new Error(
            "Unexpected local account presence during email token step"
          );
        }
        await requestEmailTokenVerification(storeService, {
          login,
        });
        void sendAskAuthenticationEventLog(
          loginServices,
          VerificationMode.EmailToken
        );
        storeService.dispatch(updateLoginStepInfoStep(LoginStep.OTPToken));
        SessionCommunication.triggerOpenSessionTokenSent({
          isResendAction: false,
          login,
        });
        return LoginResultEnum.TokenMissing;
      case AuthenticationCode.USE_LOCAL_UKI:
        const uki = ukiSelector(storeService.getState());
        if (uki) {
          return initInitialSession(
            loginServices,
            PersistData.PERSIST_DATA_YES
          );
        } else {
          throw new Error(AuthenticationCode[AuthenticationCode.UNKNOWN_UKI]);
        }
      case AuthenticationCode.ASK_DASHLANE_AUTHENTICATOR:
        accountExistLocally = await sessionService
          .getInstance()
          .user.accountExistsLocally();
        if (accountExistLocally) {
          throw new Error(
            "Unexpected local account presence during dashlane authenticator step"
          );
        }
        void sendAskAuthenticationEventLog(
          loginServices,
          VerificationMode.AuthenticatorApp
        );
        storeService.dispatch(
          updateLoginStepInfoStep(LoginStep.DashlaneAuthenticator)
        );
        SessionCommunication.triggerOpenSessionDashlaneAuthenticator();
        return LoginResultEnum.DashlaneAuthenticatorApprovalMissing;
      default:
        throw new Error(AuthenticationCode[AuthenticationCode.UNKNOWN_ERROR]);
    }
  } catch (error) {
    const errorCode =
      SessionCommunication.getAuthenticationCodeFromError(error);
    if (errorCode === AuthenticationCode.USER_DOESNT_EXIST) {
      if (validateLoginForAccountCreation(login)) {
        let response: RequestAccountCreationResponse;
        try {
          response = await requestAccountCreation(storeService, {
            login,
          });
        } catch {}
        if (
          response !== undefined &&
          !isApiError(response) &&
          response.ssoServiceProviderUrl
        ) {
          const customError = new Error(
            AuthenticationCode[AuthenticationCode.USER_DOESNT_EXIST_SSO]
          );
          SessionCommunication.triggerOpenSessionFailed(customError);
          return;
        }
      }
    }
    SessionCommunication.triggerOpenSessionFailed(error);
    throw error;
  }
}
async function openSessionWithDashlaneAuthenticator(
  loginServices: LoginServices,
  login: string,
  password: string,
  isDataPersisted: PersistData,
  deviceName?: string
): Promise<LoginResultEnum> {
  try {
    const { storeService, sessionService } = loginServices;
    login = normalizeEmail(login);
    await updateSessionUponLoginAction(loginServices, login, password);
    const accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    if (accountExistLocally) {
      throw new Error(
        AuthenticationCode[
          AuthenticationCode.DASHLANE_AUTHENTICATOR_ASKED_FOR_LOCAL_SESSION
        ]
      );
    }
    const authenticationCode =
      await RemoteAuthentication.registerDeviceWithDashlaneAuthenticator(
        storeService,
        isDataPersisted,
        deviceName
      );
    if (
      authenticationCode ===
      AuthenticationCode.DASHLANE_AUTHENTICATOR_LOGIN_CANCELLED
    ) {
      void sendDashlaneAuthenticatorErrorLog(loginServices as CoreServices);
      return LoginResultEnum.DashlaneAuthenticatorApprovalCancelled;
    } else if (authenticationCode !== AuthenticationCode.ASK_MASTER_PASSWORD) {
      throw new Error("unexpected status from verifyDashlaneAuthenticatorPush");
    }
    if (password) {
      return openSessionWithMasterPassword(loginServices, login, password, {
        isDataPersisted,
        loginType: "MasterPassword",
      });
    }
    SessionCommunication.triggerAskMasterPassword(login);
    return LoginResultEnum.MasterPasswordMissing;
  } catch (error) {
    if (isDashlaneAuthenticatorError(error)) {
      void sendDashlaneAuthenticatorErrorLog(loginServices as CoreServices);
    }
    SessionCommunication.triggerOpenSessionFailed(error);
  }
}
async function openSessionWithToken(
  loginServices: LoginServices,
  login: string,
  password: string,
  token: string,
  isDataPersisted: PersistData,
  deviceName?: string
): Promise<LoginResultEnum> {
  try {
    const { storeService, sessionService } = loginServices;
    login = normalizeEmail(login);
    await updateSessionUponLoginAction(loginServices, login, password);
    await verifyEmailTokenValidity(token);
    const accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    if (accountExistLocally) {
      throw new Error(
        AuthenticationCode[AuthenticationCode.TOKEN_PROVIDED_FOR_LOCAL_SESSION]
      );
    }
    const authenticationCode =
      await RemoteAuthentication.registerDeviceWithToken(
        storeService,
        isDataPersisted,
        makeEmailToken(token),
        false,
        login,
        deviceName
      );
    if (authenticationCode !== AuthenticationCode.ASK_MASTER_PASSWORD) {
      throw new Error("unexpected status from verifyOtpOrToken");
    }
    if (password) {
      return openSessionWithMasterPassword(loginServices, login, password, {
        isDataPersisted,
        loginType: "MasterPassword",
      });
    }
    SessionCommunication.triggerAskMasterPassword(login);
    return LoginResultEnum.MasterPasswordMissing;
  } catch (error) {
    if (isTokenOrOTPError(error)) {
      void sendEmailTokenErrorLog(loginServices as CoreServices);
    }
    SessionCommunication.triggerOpenSessionFailed(error);
    throw error;
  }
}
export async function updateSessionUponLoginAction(
  loginServices: LoginServices,
  login: string,
  masterPassword?: string,
  options?: {
    authorizeDifferentLogin?: DifferentLoginAuthorized;
    serverKey?: string;
  }
): Promise<void> {
  const {
    storeService,
    sessionService,
    moduleClients: { session },
  } = loginServices;
  const sessionResult = await firstValueFrom(
    session.queries.selectedOpenedSession()
  );
  if (!isSuccess(sessionResult)) {
    throw new Error(AuthenticationCode[AuthenticationCode.UNKNOWN_ERROR]);
  }
  if (sessionResult.data) {
    throw new Error(
      AuthenticationCode[AuthenticationCode.SESSION_ALREADY_OPENED]
    );
  }
  if (login === "") {
    throw new Error(AuthenticationCode[AuthenticationCode.EMPTY_LOGIN]);
  }
  if (!isValidLogin(login)) {
    throw new Error(AuthenticationCode[AuthenticationCode.INVALID_LOGIN]);
  }
  storeService.dispatch(updateLoginStepInfoLogin(login));
  if (masterPassword === "") {
    throw new Error(
      AuthenticationCode[AuthenticationCode.EMPTY_MASTER_PASSWORD]
    );
  }
  let authorizeDifferentLogin = DifferentLoginAuthorized.FORBIDDEN;
  if (options && options.authorizeDifferentLogin !== undefined) {
    authorizeDifferentLogin = options.authorizeDifferentLogin;
  }
  if (storeService.getUserLogin() && storeService.getUserLogin() !== login) {
    if (storeService.isAuthenticated()) {
      await sessionService.close();
    }
    if (authorizeDifferentLogin === DifferentLoginAuthorized.FORBIDDEN) {
      throw new Error(
        AuthenticationCode[
          AuthenticationCode.DIFFERENT_LOGIN_PROVIDED_WITH_TOKEN_OR_OTP
        ]
      );
    }
  }
  if (
    storeService.hasSessionId() &&
    storeService.getUserLogin() === login &&
    masterPassword
  ) {
    storeService.dispatch(updateMasterPassword(masterPassword));
  }
  const serverKey = options && options.serverKey;
  if (serverKey) {
    storeService.dispatch(updateServerKey(serverKey));
  }
  if (
    storeService.getUserLogin() !== login ||
    typeof masterPassword === "undefined"
  ) {
    const ssoSettings = ssoSettingsSelector(storeService.getState());
    await sessionService.close(false);
    sessionService.setInstance(login, masterPassword);
    if (ssoSettings.ssoToken) {
      storeService.dispatch(storeSSOSettings(ssoSettings));
    }
  }
}
async function openSessionWithOTP(
  loginServices: LoginServices,
  login: string,
  password: string,
  otp: string,
  isDataPersisted?: PersistData,
  withBackupCode?: boolean
): Promise<LoginResultEnum> {
  const {
    storageService,
    storeService,
    sessionService,
    moduleClients: { "carbon-legacy": carbonClient },
  } = loginServices;
  try {
    login = normalizeEmail(login);
    await updateSessionUponLoginAction(loginServices, login, password);
    await verifyOTPNotEmpty(otp);
    const accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    if (!accountExistLocally) {
      return openSessionWithOTPForNewDevice(
        loginServices,
        login,
        password,
        otp,
        isDataPersisted,
        undefined,
        withBackupCode
      );
    }
    storeService.dispatch(updateisUsingBackupCode(withBackupCode));
    if (storeService.getAccountInfo().otpType !== OtpType.OTP_LOGIN) {
      throw new Error(
        AuthenticationCode[
          AuthenticationCode.OTP_PROVIDED_FOR_LOCAL_NON_OTP_SESSION
        ]
      );
    }
    const authTicketResponse = await convertTokenToAuthTicket(
      storeService,
      makeOTP(otp)
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
    const authTicket = authTicketResponse.authTicket;
    const authenticationCode = await LocalAuthentication.completeLogin(
      storeService,
      storageService,
      carbonClient,
      authTicket,
      withBackupCode ?? false
    );
    if (authenticationCode !== AuthenticationCode.ASK_MASTER_PASSWORD) {
      throw new Error("unexpected status from verifyOtpOrToken");
    }
    if (password) {
      return openSessionWithMasterPassword(loginServices, login, password, {
        isDataPersisted,
      });
    }
    SessionCommunication.triggerAskMasterPassword(login);
    return LoginResultEnum.MasterPasswordMissing;
  } catch (error) {
    if (isDeviceRevokedError(error)) {
      const localAccounts = await getLocalAccounts(
        storeService,
        storageService
      );
      SessionCommunication.sendLocalAccounts(localAccounts);
    }
    if (isTokenOrOTPError(error)) {
      sendOTPErrorLog(loginServices as CoreServices, withBackupCode);
    }
    SessionCommunication.triggerOpenSessionFailed(error);
    throw error;
  }
}
async function openSessionWithOTPForNewDevice(
  loginServices: LoginServices,
  login: string,
  password: string,
  otp: string,
  isDataPersisted: PersistData,
  deviceName?: string,
  withBackupCode?: boolean
): Promise<LoginResultEnum> {
  try {
    const { storeService, sessionService } = loginServices;
    const normalizedLogin = normalizeEmail(login);
    await updateSessionUponLoginAction(
      loginServices,
      normalizedLogin,
      password
    );
    await verifyOTPNotEmpty(otp);
    const accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    if (accountExistLocally) {
      throw new Error("Unexpected local account presence during OTP1 step");
    }
    const authenticationCode =
      await RemoteAuthentication.registerDeviceWithToken(
        storeService,
        isDataPersisted,
        makeOTP(otp),
        withBackupCode ?? false,
        login,
        deviceName
      );
    if (authenticationCode !== AuthenticationCode.ASK_MASTER_PASSWORD) {
      throw new Error("unexpected status from device registration");
    }
    if (password) {
      return openSessionWithMasterPassword(
        loginServices,
        normalizedLogin,
        password,
        { isDataPersisted }
      );
    }
    SessionCommunication.triggerAskMasterPassword(normalizedLogin);
    return LoginResultEnum.MasterPasswordMissing;
  } catch (error) {
    if (isTokenOrOTPError(error)) {
      sendOTPForNewDeviceErrorLog(
        loginServices as CoreServices,
        withBackupCode
      );
    }
    SessionCommunication.triggerOpenSessionFailed(error);
    throw error;
  }
}
export async function openSessionWithMasterPassword(
  loginServices: LoginServices,
  login: string,
  password: string,
  options?: {
    rememberMasterPassword?: boolean;
    shouldRememberMeForSSO?: boolean;
    triggeredByRememberMeType?: RememberMeType;
    isWebAuthnAuthenticatorRoaming?: boolean;
    isDataPersisted?: PersistData;
    requiredPermissions?: AdminPermissionLevel;
    serverKey?: string;
    loginType?: LoginType;
  },
  addLogHistory?: (message: string) => void
): Promise<LoginResultEnum> {
  const loginType = options?.loginType ?? "MasterPassword";
  try {
    const {
      storeService,
      sessionService,
      masterPasswordEncryptorService,
      localDataEncryptorService,
      remoteDataEncryptorService,
      localStorageService,
      storageService,
      moduleClients: { "carbon-legacy": carbonClient },
    } = loginServices;
    if (
      loginType === "CreatedPasswordlessAccount" ||
      loginType === "DeviceToDevice"
    ) {
      storeService.dispatch(
        storeAccountAuthenticationType("invisibleMasterPassword")
      );
    } else {
      const state = storeService.getState();
      const deviceAccessKey = getDeviceAccessKeySelector(state, login);
      let accountAuthenticationType: AccountAuthenticationType;
      try {
        const response = await getAuthenticationMethodsForLogin(storeService, {
          login,
          deviceAccessKey,
          methods: localSupportedAuthenticationMethod,
        });
        if (isApiError(response)) {
          return await LocalAuthentication.handleGetAuthenticationMethodsForLoginError(
            storageService,
            carbonClient,
            response,
            login
          );
        }
        accountAuthenticationType = response.accountType;
      } catch (error) {
        accountAuthenticationType = "masterPassword";
      }
      storeService.dispatch(
        storeAccountAuthenticationType(accountAuthenticationType)
      );
    }
    let isDataPersisted = options && options.isDataPersisted;
    addLogHistory?.(`isDataPersisted? ${isDataPersisted}`);
    if (typeof isDataPersisted === "undefined") {
      isDataPersisted = storeService.getAccountInfo().persistData;
    }
    const serverKey = options && options.serverKey;
    addLogHistory?.(`serverKey null, undefined, or empty? ${!serverKey}`);
    const rememberMasterPassword = Boolean(
      options && options.rememberMasterPassword
    );
    addLogHistory?.(`rememberMasterPassword? ${rememberMasterPassword}`);
    const shouldRememberMeForSSO = Boolean(options?.shouldRememberMeForSSO);
    login = normalizeEmail(login);
    addLogHistory?.(`updateSessionUponLoginAction START`);
    await updateSessionUponLoginAction(loginServices, login, password, {
      authorizeDifferentLogin: DifferentLoginAuthorized.AUTHORIZED,
      serverKey,
    });
    addLogHistory?.(`updateSessionUponLoginAction SUCCESS`);
    const accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    addLogHistory?.(`accountExistLocally? ${accountExistLocally}`);
    if (accountExistLocally) {
      const localStorage = localStorageService.getInstance();
      const doesLocalKeyExist = await localStorage.doesLocalKeyExist();
      addLogHistory?.(`doesLocalKeyExist? ${doesLocalKeyExist}`);
      if (doesLocalKeyExist) {
        try {
          const localKeyRawClear = await localStorage.getLocalKey();
          if (localKeyRawClear.length < 64) {
            addLogHistory?.(`localKeyMigrationRequired? ${true}`);
            storeService.dispatch(updateIsLocalKeyMigrationRequired(true));
          }
          const serverKey = "";
          addLogHistory?.(`set localDataEncryptorService START`);
          const cryptoConfig = getNoDerivationCryptoConfig();
          localDataEncryptorService.setInstance(
            { raw: localKeyRawClear },
            serverKey,
            cryptoConfig
          );
          addLogHistory?.(`set localDataEncryptorService SUCCESS`);
          addLogHistory?.(`updateLocalKey START`);
          storeService.dispatch(updateLocalKey(localKeyRawClear));
          addLogHistory?.(`updateLocalKey SUCCESS`);
        } catch (error) {
          void sendMasterPasswordLoginErrorLog(
            loginServices as CoreServices,
            false
          );
          throw new Error(
            AuthenticationCode[AuthenticationCode.WRONG_PASSWORD]
          );
        }
      }
      addLogHistory?.(`loadLocalData START`);
      await LocalAuthentication.loadLocalData(
        sessionService,
        storeService,
        masterPasswordEncryptorService
      );
      addLogHistory?.(`loadLocalData SUCCESS`);
    } else {
      const state = storeService.getState();
      const dataEncryptorService =
        isRemoteKeyActivatedSelector(state) && remoteDataEncryptorService
          ? remoteDataEncryptorService
          : masterPasswordEncryptorService;
      addLogHistory?.(`validateMasterPassword START`);
      await RemoteAuthentication.validateMasterPassword(
        storeService,
        dataEncryptorService
      );
      addLogHistory?.(`validateMasterPassword SUCCESS`);
    }
    addLogHistory?.(`rememberMasterPasswordUpdated START`);
    if (options?.rememberMasterPassword) {
      storeService.dispatch(
        rememberMasterPasswordUpdated(rememberMasterPassword)
      );
    }
    addLogHistory?.(`rememberMasterPasswordUpdated SUCCESS`);
    if (shouldRememberMeForSSO) {
      storeService.dispatch(
        shouldRememberMeForSSOUpdated(shouldRememberMeForSSO)
      );
    } else {
      const ssoUserSettings = await firstValueFrom(
        loginServices.moduleClients.authenticationFlow.queries.getSsoUserSettings()
      );
      if (isSuccess(ssoUserSettings)) {
        if (!ssoUserSettings.data.rememberMeForSSOPreference) {
          await disableAutologin(loginServices as CoreServices);
        }
      }
    }
    LocalAuthentication.cacheIsSso(
      storeService.getAccountInfo().login,
      loginType === "SSO"
    );
    if (!accountExistLocally) {
      addLogHistory?.(`initInitialSession START`);
      if (loginType === "SSO") {
        sendLoginSuccessEventLog({
          services: loginServices as CoreServices,
          isInitial: true,
          loginType: options?.loginType,
        });
      }
      return await initInitialSession(loginServices, isDataPersisted, options);
    } else {
      addLogHistory?.(`initLocalSession START`);
      void sendLoginSuccessEventLog({
        services: loginServices as CoreServices,
        isInitial: false,
        loginType: loginType,
      });
      return await initLocalSession(loginServices, options);
    }
  } catch (error) {
    if (
      error.message &&
      error.message === AuthenticationCode[AuthenticationCode.WRONG_PASSWORD]
    ) {
      void sendMasterPasswordLoginErrorLog(loginServices as CoreServices, true);
    }
    SessionCommunication.triggerOpenSessionFailed(error);
    throw error;
  }
}
const validatePermissions = async (
  storeService: StoreService,
  sessionService: SessionService,
  requiredPermissions: AdminPermissionLevel
) => {
  const isAdmin = hasTACAccessInCurrentSpace(storeService);
  if (possibleAdminPermissions.includes(requiredPermissions) && !isAdmin) {
    if (storeService.isAuthenticated()) {
      await sessionService.close();
    }
    throw new Error(AuthenticationCode[AuthenticationCode.USER_UNAUTHORIZED]);
  }
};
const notifySessionOpened = async (
  storeService: StoreService,
  storageService: StorageService
) => {
  const state = storeService.getState();
  const pairingId = pairingIdSelector(state);
  SessionCommunication.triggerSessionOpened(
    storeService,
    storageService,
    pairingId
  );
};
const persistLocalAccountInfo = (
  storeService: StoreService,
  options: SessionDidOpenOptions
) => {
  const { login, persistData, sessionStartTime } =
    storeService.getAccountInfo();
  if (persistData === PersistData.PERSIST_DATA_YES) {
    storeUserPublicSetting(login, "lastSuccessfulLoginTime", sessionStartTime);
    if (
      options?.triggeredByRememberMeType === undefined ||
      options?.triggeredByRememberMeType === "disabled"
    ) {
      storeUserPublicSetting(
        login,
        "lastMasterPasswordOpenSessionTimestamp",
        sessionStartTime
      );
    }
  }
};
const firstSessionSync = async (
  userSessionService: UserSessionService
): Promise<void> => {
  const accountExistsLocally = await userSessionService.accountExistsLocally();
  if (accountExistsLocally) {
    await userSessionService.attemptSync(Trigger.Login);
  } else {
    await userSessionService.sync(Trigger.InitialLogin);
  }
};
const waitForSyncBeforeNotificationIfWeHaveTo = async (
  services: LoginServices
): Promise<boolean> => {
  const { sessionService, storeService } = services;
  const userSessionService = sessionService.getInstance().user;
  const state = storeService.getState();
  const inAccountRecoveryFlow = recoveryInProgressSelector(state);
  const needsSSOMigration =
    ssoMigrationInfoSelector(state).migration !== undefined;
  if (needsSSOMigration || inAccountRecoveryFlow) {
    return true;
  }
  const isInitialSync = !(await userSessionService.accountExistsLocally());
  const changeMPisCompleting = changeMPinProgressSelector(state);
  if (isInitialSync || changeMPisCompleting) {
    try {
      await firstSessionSync(userSessionService);
    } catch (e) {
      throw new Error(
        AuthenticationCode[AuthenticationCode.UNKNOWN_SYNC_ERROR]
      );
    }
    return true;
  }
  return false;
};
async function initInitialSession(
  loginServices: LoginServices,
  isDataPersisted: PersistData,
  options?: SessionDidOpenOptions
): Promise<LoginResultEnum> {
  const {
    localDataEncryptorService,
    sessionService,
    storageService,
    storeService,
    moduleClients,
  } = loginServices;
  const { login, otpType } = storeService.getAccountInfo();
  await deleteAllLocalUserData(
    storageService,
    moduleClients["carbon-legacy"],
    login
  );
  await generateLocalkeyAndSetupEncryptorService(
    localDataEncryptorService,
    storeService,
    sessionService,
    isDataPersisted
  );
  if (isDataPersisted === PersistData.PERSIST_DATA_YES) {
    LocalAuthentication.cacheOtpStatus(
      storeService.getAccountInfo().login,
      otpType
    );
    await persistLocalUsersAuthenticationData(storageService, storeService);
  }
  const userSessionService = sessionService.getInstance().user;
  await userSessionService.refreshSessionData();
  if (options?.requiredPermissions) {
    await validatePermissions(
      storeService,
      sessionService,
      options.requiredPermissions
    );
  }
  const deviceLimitStatus = await getDeviceLimitStatus(loginServices);
  if (deviceLimitStatus._tag !== "noDeviceLimit") {
    await startDeviceLimitFlow(loginServices, deviceLimitStatus);
    return LoginResultEnum.DeviceLimitFlow;
  }
  return sessionDidOpen(loginServices, options);
}
async function initLocalSession(
  loginServices: LoginServices,
  options?: SessionDidOpenOptions
) {
  const { sessionService, storeService, localDataEncryptorService } =
    loginServices;
  const userSessionService = sessionService.getInstance().user;
  const state = storeService.getState();
  if (isLocalKeyMigrationRequiredSelector(state)) {
    await generateLocalkeyAndSetupEncryptorService(
      localDataEncryptorService,
      storeService,
      sessionService,
      PersistData.PERSIST_DATA_YES
    );
    await userSessionService.persistAllData();
  }
  await userSessionService.refreshSessionData();
  if (options?.requiredPermissions) {
    await validatePermissions(
      storeService,
      sessionService,
      options.requiredPermissions
    );
  }
  const deviceLimitStatus = await attemptGetDeviceLimitStatus(loginServices);
  if (deviceLimitStatus._tag !== "noDeviceLimit") {
    await startDeviceLimitFlow(loginServices, deviceLimitStatus);
    return LoginResultEnum.DeviceLimitFlow;
  }
  return sessionDidOpen(loginServices, options);
}
export async function sessionDidOpen(
  loginServices: LoginServices,
  options?: SessionDidOpenOptions
) {
  try {
    const {
      autoLoginService,
      eventBusService,
      sessionService,
      storeService,
      storageService,
      wsService,
    } = loginServices;
    const userSessionService = sessionService.getInstance().user;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    storeService.dispatch(confirmUserAuthentication());
    persistLocalAccountInfo(storeService, options);
    const syncCompleted = await waitForSyncBeforeNotificationIfWeHaveTo(
      loginServices
    );
    await getAndTriggerRefreshAccountInfo(
      storeService,
      sessionService,
      wsService
    );
    notifySessionOpened(storeService, storageService);
    if (syncCompleted === false) {
      try {
        await firstSessionSync(userSessionService);
      } catch (e) {
        throw new Error(
          AuthenticationCode[AuthenticationCode.UNKNOWN_SYNC_ERROR]
        );
      }
    }
    const localAccounts = await getLocalAccounts(storeService, storageService);
    sendLocalAccounts(localAccounts);
    const localAccountRememberMeTypeIsNotWebauthn =
      getLocalAccountRememberMeType(login) !== "webauthn";
    if (
      storeService.getUserSession().rememberMasterPassword &&
      localAccountRememberMeTypeIsNotWebauthn
    ) {
      autoLoginService.initialize();
    }
    if (
      storeService.getUserSession().shouldRememberMeForSSO &&
      localAccountRememberMeTypeIsNotWebauthn
    ) {
      await persistLocalAccountRememberMeType(storeService, "sso");
      storeService.dispatch(setRememberMeTypeAction("sso"));
    }
    eventBusService.carbonSessionOpened({ login });
    if (options?.triggeredByRememberMeType !== "autologin") {
      storeService.dispatch(updateLastMasterPasswordCheck());
    }
    const nodePremiumStatus = nodePremiumStatusSelector(state);
    if (
      nodePremiumStatus &&
      nodePremiumStatus.b2bStatus?.statusCode === "in_team"
    ) {
      userSessionService.startPeriodic2FAInfoRefresh();
    }
    await refreshTwoFactorAuthenticationInfoService(storeService, wsService);
    storeService.dispatch(updateSessionDidOpen(true));
    return LoginResultEnum.LoggedIn;
  } catch (err) {
    const { storeService } = loginServices;
    storeService.dispatch(userAuthenticationFailed());
    storeService.dispatch(updateSessionDidOpen(false));
    throw err;
  }
}
const isDeviceRevokedError = (error: any) => {
  return (
    error &&
    typeof error === "object" &&
    error.message ===
      AuthenticationCode[AuthenticationCode.DEVICE_NOT_REGISTERED]
  );
};
const isTokenOrOTPError = (error: any) => {
  return error?.message && TokenOrOTPErrorCode.includes(error.message);
};
const isDashlaneAuthenticatorError = (error: any) => {
  return (
    error?.message && DashlaneAuthenticatorErrorCode.includes(error.message)
  );
};
const checkLogin = async (
  storeService: StoreService,
  storageService: StorageService,
  carbonClient: CarbonLegacyClient,
  wsService: WSService,
  accountExistLocally: boolean
) => {
  if (accountExistLocally) {
    try {
      return await LocalAuthentication.checkLogin(
        storeService,
        storageService,
        carbonClient
      );
    } catch (error) {
      if (!isDeviceRevokedError(error)) {
        throw error;
      }
    }
  }
  const uki = ukiSelector(storeService.getState());
  if (uki) {
    return RemoteAuthentication.checkLoginWithUki(storeService, wsService, uki);
  }
  return RemoteAuthentication.requestDeviceRegistration(storeService);
};
function verifyOTPNotEmpty(otp: string) {
  if (!otp || otp.length === 0) {
    throw new Error(AuthenticationCode[AuthenticationCode.EMPTY_OTP]);
  }
}
const EMAIL_TOKEN_REGEXP = /^[0-9]{6}$/;
function verifyEmailTokenValidity(token: string) {
  if (!token) {
    throw new Error(AuthenticationCode[AuthenticationCode.EMPTY_TOKEN]);
  }
  if (!EMAIL_TOKEN_REGEXP.test(token)) {
    throw new Error(AuthenticationCode[AuthenticationCode.TOKEN_NOT_VALID]);
  }
}
export enum DifferentLoginAuthorized {
  AUTHORIZED,
  FORBIDDEN,
}
async function loadAccountCreationInfos(
  loginServices: LoginServices,
  login: string,
  password: string,
  deviceName: string,
  deviceKeys: DeviceKeys,
  lastSyncTimestamp: number,
  isDataPersisted: PersistData
) {
  const securedDeviceName = secureDeviceName(deviceName);
  await updateSessionUponLoginAction(loginServices, login, password);
  loginServices.storeService.dispatch(
    deviceRegistered(
      makeDeviceRegistrationKeys(deviceKeys.accessKey, deviceKeys.secretKey),
      isDataPersisted,
      login
    )
  );
  loginServices.storeService.dispatch(registerDeviceName(securedDeviceName));
  loginServices.storeService.dispatch(registerLastSync(lastSyncTimestamp));
}
