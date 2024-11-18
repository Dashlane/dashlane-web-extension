import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  AuthenticationCode,
  ChangeMPFlowPath,
  LoginNotificationType,
  LoginViaSSO,
  LoginViaSsoCode,
  LoginViaSSOResult,
  MigrationMPToSso,
  NotificationName,
  SsoMigrationServerMethod,
} from "@dashlane/communication";
import { createSSOAccount } from "Account/Creation/services/createSSOAccount";
import { updateLocalUserInfo } from "Authentication/Store/localUsers/actions";
import { addNewLoginNotification } from "InMemoryInterSessionUnsyncedSettings/Store/loginNotifications/actions";
import { normalizeEmail } from "Utils";
import {
  makeLoginController,
  openSessionWithMasterPassword,
} from "Login/LoginController";
import { secureDeviceName } from "Device/secure-device-name";
import { getNoDerivationCryptoConfig } from "Libs/CryptoCenter/Helpers/cryptoConfig";
import { getEncryptionKeyBuffer } from "Libs/CryptoCenter/Helpers/encryptionKeys";
import {
  arrayBufferToText,
  base64ToBuffer,
} from "Libs/CryptoCenter/Helpers/Helper";
import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
import { isApiError } from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { updateRemoteKey } from "Session/Store/session/actions";
import { registerDeviceWithToken } from "Session/RemoteAuthentication";
import { PersistData } from "Session/types";
import { masterPasswordSelector } from "Session/selectors";
import { ssoSettingsSelector } from "Session/sso.selectors";
import { makeSsoToken } from "Session";
import { completeLoginWithAuthTicket } from "Libs/DashlaneApi/services/authentication/complete-login-with-auth-ticket";
import {
  formatAPIError,
  isSupportedTransitionFlow,
  makeReturnErrorObject,
  successResponse,
} from "Login/SSO/utils";
import { changeMasterPassword } from "ChangeMasterPassword/change-master-password";
import { convertTokenToAuthTicket } from "Session/performValidation";
import { OtpType } from "Session/Store/account/index";
import {
  resetSSOSettings,
  storeSSOSettings,
} from "Session/Store/ssoSettings/actions";
import { sendSsoLoginErrorLog } from "Login/helpers/logs";
import { markNotificationAsUnseen } from "Notifications/services/mark-notifications-as-unseen";
import { sendExceptionLog } from "Logs/Exception";
import Debugger from "Logs/Debugger";
import { getDeviceAccessKeySelector } from "Authentication/selectors";
export async function loginViaSSO(
  services: CoreServices,
  params: LoginViaSSO
): Promise<LoginViaSSOResult> {
  const { sessionService, storeService } = services;
  const {
    ssoServiceProviderKey,
    exist,
    ssoToken,
    consents,
    currentAuths = SsoMigrationServerMethod.SSO,
    expectedAuths = SsoMigrationServerMethod.SSO,
    inStore,
    anonymousUserId,
  } = params;
  try {
    const login = normalizeEmail(params.login);
    const previousLogin = services.storeService.getUserLogin();
    if (previousLogin) {
      if (login !== previousLogin) {
        const error = new Error(
          "SSO Login flow with previous login attempt data is prohibited!"
        ) as Error & {
          _type: LoginViaSsoCode;
        };
        error._type = LoginViaSsoCode.SSO_LOGIN_CORRUPT;
        throw error;
      }
    }
    const deviceName = secureDeviceName(params.deviceName);
    const cleanParams = {
      ...params,
      login,
      deviceName,
    };
    if ((!ssoServiceProviderKey || !login) && !inStore) {
      storeService.dispatch(
        addNewLoginNotification({
          type: LoginNotificationType.SSO_SETUP_ERROR,
        })
      );
      return makeReturnErrorObject(LoginViaSsoCode.EMPTY_LOGIN);
    }
    if (!exist) {
      const newUserParams = {
        ssoServiceProviderKey,
        login,
        deviceName,
        ssoToken,
        consents,
        anonymousUserId,
      };
      return await createSSOAccount(services, newUserParams);
    }
    if (!isSupportedTransitionFlow(currentAuths, expectedAuths)) {
      storeService.dispatch(
        addNewLoginNotification({
          type: LoginNotificationType.SSO_SETUP_ERROR,
        })
      );
      return makeReturnErrorObject(LoginViaSsoCode.UNSUPPORTED_TRANSITION);
    }
    const shouldHandleMPToSSOMigration =
      currentAuths === SsoMigrationServerMethod.MP &&
      expectedAuths === SsoMigrationServerMethod.SSO;
    if (shouldHandleMPToSSOMigration) {
      return await handleMPtoSSOMigration(services, cleanParams);
    }
    const shouldHandleSSOToMPMigration =
      currentAuths === SsoMigrationServerMethod.SSO &&
      expectedAuths === SsoMigrationServerMethod.MP;
    if (shouldHandleSSOToMPMigration) {
      const ssoSettings = {
        ssoUser: true,
        migration: AuthenticationFlowContracts.SSOMigrationType.SSO_TO_MP,
      };
      storeService.dispatch(storeSSOSettings(ssoSettings));
      cleanParams.requiredPermissions = null;
    }
    sessionService.setInstance(login, undefined);
    const accountExistLocally = await sessionService
      .getInstance()
      .user.accountExistsLocally();
    if (!accountExistLocally) {
      return await completeDeviceRegistration(services, cleanParams);
    }
    return await completeLoginOnExistingDevice(services, cleanParams);
  } catch (error) {
    return handleSSOError({ services, error });
  }
}
function handleSSOError({
  services,
  error,
}: {
  services: CoreServices;
  error:
    | Error
    | (Error & {
        _type: LoginViaSsoCode;
      });
}) {
  void sendExceptionLog({ error });
  Debugger.log(error.message, error);
  void sendSsoLoginErrorLog(services);
  services.storeService.dispatch(
    addNewLoginNotification({
      type:
        (
          error as Error & {
            _type: LoginViaSsoCode;
          }
        )._type === LoginViaSsoCode.SSO_LOGIN_CORRUPT
          ? LoginNotificationType.SSO_LOGIN_CORRUPT
          : LoginNotificationType.UNKNOWN_ERROR,
      message: error.message,
    })
  );
  return makeReturnErrorObject(
    ("_type" in error && error._type) || LoginViaSsoCode.UNKNOWN_ERROR,
    error.message
  );
}
const handleMPtoSSOMigration = async (
  services: CoreServices,
  cleanParams: LoginViaSSO
) => {
  const { storeService } = services;
  let { ssoServiceProviderKey, ssoToken } = cleanParams;
  const { login } = cleanParams;
  const { isAuthenticated, otpType } = storeService.getAccountInfo();
  if (cleanParams.inStore) {
    const ssoInfo = ssoSettingsSelector(storeService.getState());
    ssoServiceProviderKey = ssoInfo.ssoServiceProviderKey;
    ssoToken = ssoInfo.ssoToken;
    if (!ssoServiceProviderKey || !ssoToken) {
      storeService.dispatch(
        addNewLoginNotification({
          type: LoginNotificationType.SSO_SETUP_ERROR,
        })
      );
      return makeReturnErrorObject(LoginViaSsoCode.SSO_VERIFICATION_FAILED);
    }
  }
  if (!isAuthenticated) {
    const ssoSettings = {
      ssoUser: true,
      serviceProviderUrl: "",
      ssoServiceProviderKey,
      ssoToken,
      migration: AuthenticationFlowContracts.SSOMigrationType.MP_TO_SSO,
    };
    storeService.dispatch(storeSSOSettings(ssoSettings));
    const loginController = makeLoginController(services);
    loginController.openSession(login);
    storeService.dispatch(
      addNewLoginNotification({
        type: LoginNotificationType.RELOGIN_NEEDED,
      })
    );
    return makeReturnErrorObject(LoginViaSsoCode.INNACTIVE_SESSION);
  }
  if (otpType === OtpType.NO_OTP) {
    const { success } = await convertTokenToAuthTicket(
      storeService,
      makeSsoToken(ssoToken)
    );
    if (!success) {
      storeService.dispatch(
        addNewLoginNotification({
          type: LoginNotificationType.SSO_SETUP_ERROR,
        })
      );
      return makeReturnErrorObject(LoginViaSsoCode.SSO_VERIFICATION_FAILED);
    }
  }
  const params: MigrationMPToSso = {
    newPassword: ssoServiceProviderKey,
    flow: ChangeMPFlowPath.MP_TO_SSO,
  };
  const response = await changeMasterPassword(services, params);
  if (response.success === false) {
    storeService.dispatch(
      addNewLoginNotification({
        type: LoginNotificationType.UNKNOWN_ERROR,
        message: response.error.code,
      })
    );
    return response;
  }
  storeService.dispatch(resetSSOSettings());
  await markNotificationAsUnseen(
    services,
    NotificationName.MpToSsoMigrationDoneDialog
  );
  return successResponse();
};
const completeLoginOnExistingDevice = async (
  services: CoreServices,
  {
    login,
    ssoServiceProviderKey,
    ssoToken,
    requiredPermissions,
    shouldRememberMeForSSO,
  }: LoginViaSSO
): Promise<LoginViaSSOResult> => {
  const { storeService } = services;
  const deviceAccessKey = await getDeviceAccessKeySelector(
    storeService.getState(),
    login
  );
  if (!deviceAccessKey) {
    throw new Error(
      AuthenticationCode[AuthenticationCode.DEVICE_NOT_REGISTERED]
    );
  }
  const authTicketResponse = await convertTokenToAuthTicket(
    storeService,
    makeSsoToken(ssoToken)
  );
  if (authTicketResponse.success === false) {
    const {
      error: { message },
    } = authTicketResponse;
    storeService.dispatch(
      addNewLoginNotification({
        type: LoginNotificationType.SSO_SETUP_ERROR,
      })
    );
    return makeReturnErrorObject(
      LoginViaSsoCode.SSO_VERIFICATION_FAILED,
      message
    );
  }
  const authTicket = authTicketResponse.authTicket;
  const response = await completeLoginWithAuthTicket(storeService, {
    login,
    deviceAccessKey,
    authTicket,
  });
  if (isApiError(response)) {
    return formatAPIError(response);
  }
  const { masterPasswordEncryptorService, remoteDataEncryptorService } =
    services;
  const { ssoServerKey, remoteKeys } = response;
  const serverKeyBuffer = base64ToBuffer(ssoServerKey);
  const remoteKey = remoteKeys.filter((key) => key.type === "sso")[0];
  const emptyServerKey = "";
  let encryptionKeyRaw: string | undefined;
  try {
    const ssoKeyBuffer = base64ToBuffer(ssoServiceProviderKey);
    const encryptionKeyBuffer = getEncryptionKeyBuffer(
      ssoKeyBuffer,
      serverKeyBuffer,
      { skipDerivation: true }
    );
    encryptionKeyRaw = arrayBufferToText(encryptionKeyBuffer);
    const cryptoConfig = getNoDerivationCryptoConfig();
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
    return {
      success: false,
      error: {
        code: LoginViaSsoCode.WRONG_PASSWORD,
      },
    };
  }
  const isDataPersisted = PersistData.PERSIST_DATA_YES;
  await openSessionWithMasterPassword(services, login, encryptionKeyRaw, {
    isDataPersisted,
    serverKey: emptyServerKey,
    requiredPermissions,
    loginType: "SSO",
    shouldRememberMeForSSO,
  });
  return successResponse();
};
const completeDeviceRegistration = async (
  services: CoreServices,
  params: LoginViaSSO
): Promise<LoginViaSSOResult> => {
  const {
    storeService,
    masterPasswordEncryptorService,
    remoteDataEncryptorService,
  } = services;
  const {
    deviceName,
    ssoToken,
    login,
    ssoServiceProviderKey,
    requiredPermissions,
    shouldRememberMeForSSO,
  } = params;
  storeService.dispatch(updateLocalUserInfo(login, { ssoActivatedUser: true }));
  const isDataPersisted = PersistData.PERSIST_DATA_YES;
  const ssoOptions = {
    masterPasswordEncryptorService,
    remoteDataEncryptorService,
    ssoServiceProviderKey,
  };
  await registerDeviceWithToken(
    storeService,
    isDataPersisted,
    makeSsoToken(ssoToken),
    false,
    login,
    deviceName,
    ssoOptions
  );
  const state = services.storeService.getState();
  const encryptionKeyRaw = masterPasswordSelector(state);
  await openSessionWithMasterPassword(services, login, encryptionKeyRaw, {
    isDataPersisted,
    serverKey: "",
    requiredPermissions,
    loginType: "SSO",
    shouldRememberMeForSSO,
  });
  return successResponse();
};
