import { GetAuthenticationMethodsForDeviceBodyData } from "@dashlane/server-sdk/v1";
import {
  CancelRecoveryRequestResult,
  CheckLocalRecoveryKeyResult,
  CheckRecoveryRequestStatusParams,
  CheckRecoveryRequestStatusResult,
  LoginResultEnum,
  RecoverUserDataParam,
  RecoverUserDataResult,
  RecoveryApiErrorType,
  RecoverySessionCredential,
  RegisterDeviceForRecoveryParam,
  RegisterDeviceForRecoveryResult,
  SendRecoveryRequestResult,
  SetupMasterPasswordForRecoveryParam,
  SetupMasterPasswordForRecoveryResult,
  StartAccountRecoveryParam,
  StartAccountRecoveryResult,
  VerificationMethod,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { sendExceptionLog } from "Logs/Exception/";
import { generateUki } from "Session/RemoteAuthentication";
import {
  PersistData,
  remoteSupportedAuthenticationMethod,
} from "Session/types";
import { ensureDeviceId } from "Application/index";
import {
  makeAsymmetricEncryption,
  makeCryptoService,
} from "Libs/CryptoCenter/SharingCryptoService";
import {
  getAuthenticationMethodsForDevice,
  isApiError,
} from "Libs/DashlaneApi";
import {
  recoveryDataSelector,
  recoveryIsOtpSelector,
  recoveryUkiSelector,
} from "Session/recovery.selectors";
import {
  masterPasswordSelector,
  serverKeySelector,
  userLoginSelector,
} from "Session/selectors";
import { updateMasterPassword } from "Session/Store/session/actions";
import {
  AuthenticationCode,
  triggerOpenSessionFailed,
} from "Session/SessionCommunication";
import {
  resetRecoverySessionData,
  saveRecoverySessionData,
} from "Session/Store/recovery/actions";
import { openSessionWithMasterPassword } from "Login/LoginController";
import {
  encryptUkiAndPrivateKey,
  extractLocalKey,
  extractPrivateKeyFromRecoveryData,
  extractRecoveryKey,
  prepareLocalDataEncryptorService,
  recoveryFlowError,
  retrieveRecoveryUkiFromStorage,
  sendRecoveryRequestToAdmin,
  validateInitialData,
} from "./recovery-helpers";
function mapVerification(
  verification: GetAuthenticationMethodsForDeviceBodyData["verifications"][number]
): VerificationMethod {
  switch (verification.type) {
    case "u2f":
      return {
        type: "u2f",
        challenges: verification.challenges ?? [],
      };
    default:
      return verification;
  }
}
export async function startAccountRecovery(
  services: CoreServices,
  startAccountRecoveryParam: StartAccountRecoveryParam
): Promise<StartAccountRecoveryResult> {
  const { storeService } = services;
  const { login } = startAccountRecoveryParam;
  const requestResponse = await getAuthenticationMethodsForDevice(
    storeService,
    {
      login,
      methods: remoteSupportedAuthenticationMethod,
    }
  );
  if (isApiError(requestResponse)) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.StartAccountRecoveryFailed,
        message: `Start account recovery failed: ${requestResponse.message}`,
      },
    };
  }
  const verificationMethod = requestResponse.verifications.map(mapVerification);
  storeService.dispatch(
    saveRecoverySessionData({
      verificationMethod,
    })
  );
  return { success: true, verification: verificationMethod };
}
export async function registerDeviceForRecovery(
  services: CoreServices,
  registerDeviceForRecoveryParam: RegisterDeviceForRecoveryParam
): Promise<RegisterDeviceForRecoveryResult> {
  try {
    const { token, login } = registerDeviceForRecoveryParam;
    const { storeService, wsService } = services;
    const state = storeService.getState();
    const platform = storeService.getPlatformInfo().platformName;
    const recovery = true;
    const requestResponse = await getAuthenticationMethodsForDevice(
      storeService,
      {
        login,
        methods: remoteSupportedAuthenticationMethod,
      }
    );
    if (isApiError(requestResponse)) {
      return {
        success: false,
        error: {
          code: RecoveryApiErrorType.RegisterDeviceFailed,
          message: "Recovery Device request registration failed",
        },
      };
    }
    const isOtp = recoveryIsOtpSelector(state);
    const deviceId = await ensureDeviceId();
    const recoveryUki = generateUki(deviceId);
    const registerUkiBaseParam = {
      uki: recoveryUki,
      login,
      platform,
      temporary: PersistData.PERSIST_DATA_NO,
      recovery,
    };
    const registerUkiOtpParam = isOtp ? { otp: token } : { token };
    const response = await wsService.authentication.registerUki({
      ...registerUkiBaseParam,
      ...registerUkiOtpParam,
    });
    if (response !== "SUCCESS") {
      return {
        success: false,
        error: {
          code: RecoveryApiErrorType.RegisterDeviceFailed,
          message: "Recovery Device registration failed",
        },
      };
    }
    storeService.dispatch(saveRecoverySessionData({ recoveryUki }));
  } catch (error) {
    sendExceptionLog({ error });
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.RegisterDeviceFailed,
        message: error.message,
      },
    };
  }
  return {
    success: true,
  };
}
export async function setupMasterPasswordForRecovery(
  services: CoreServices,
  setupMasterPasswordForRecoveryParam: SetupMasterPasswordForRecoveryParam
): Promise<SetupMasterPasswordForRecoveryResult> {
  let logHistory =
    "[Account Recovery PI] - Setup Master Password For Recovery ";
  const addLogHistory = (message: string): void => {
    logHistory += `- ${message} \n`;
  };
  try {
    const { storeService, localStorageService } = services;
    const { masterPassword } = setupMasterPasswordForRecoveryParam;
    const state = storeService.getState();
    addLogHistory(`recoveryUki select START`);
    const recoveryUki = recoveryUkiSelector(state);
    if (!recoveryUki) {
      const error: {
        code: RecoveryApiErrorType.SetupMasterPasswordForRecoveryFailed;
        message: string;
      } = {
        code: RecoveryApiErrorType.SetupMasterPasswordForRecoveryFailed,
        message: "recoveryUki does not exist",
      };
      addLogHistory(
        `setupMasterPasswordForRecovery failed with error: ${error.code} ${error.message}`
      );
      sendExceptionLog({
        message: logHistory,
        funcName: "setupMasterPasswordForRecovery",
      });
      return {
        success: false,
        error: error,
      };
    }
    addLogHistory(`recoveryUki select SUCCESS`);
    addLogHistory(`dispatch updateMasterPassword START`);
    storeService.dispatch(updateMasterPassword(masterPassword));
    addLogHistory(`dispatch updateMasterPassword SUCCESS`);
    addLogHistory(`makeCyptoService START`);
    const cryptoService = makeCryptoService();
    addLogHistory(`makeCyptoService SUCCESS`);
    addLogHistory(`generateRsaKeyPair START`);
    const { publicKey, privateKey } =
      await cryptoService.asymmetricEncryption.generateRsaKeyPair();
    addLogHistory(`generateRsaKeyPair SUCCESS`);
    addLogHistory(`dispatch saveRecoverySessionData START`);
    storeService.dispatch(saveRecoverySessionData({ publicKey }));
    addLogHistory(`dispatch saveRecoverySessionData SUCCESS`);
    addLogHistory(`encryptUkiAndPrivateKey START`);
    const recoveryDataEncrypted = await encryptUkiAndPrivateKey(
      recoveryUki,
      privateKey,
      masterPassword,
      storeService
    );
    addLogHistory(`encryptUkiAndPrivateKey SUCCESS`);
    addLogHistory(`storeRecoveryData START`);
    await localStorageService
      .getInstance()
      .storeRecoveryData(recoveryDataEncrypted);
    addLogHistory(`storeRecoveryData SUCCESS`);
    return {
      success: true,
    };
  } catch (error) {
    addLogHistory(`setupMasterPasswordForRecovery failed with error: ${error}`);
    sendExceptionLog({
      message: logHistory,
      funcName: "setupMasterPasswordForRecovery",
      precisions: error.stack,
    });
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.SetupMasterPasswordForRecoveryFailed,
        message: error.message,
      },
    };
  }
}
export async function sendRecoveryRequest(
  services: CoreServices
): Promise<SendRecoveryRequestResult> {
  try {
    const { storeService, wsService } = services;
    await sendRecoveryRequestToAdmin(storeService, wsService);
    return {
      success: true,
    };
  } catch (error) {
    sendExceptionLog({ error });
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.RecoveryRequestFailed,
        message: error.message,
      },
    };
  }
}
export async function checkRecoveryRequestStatus(
  services: CoreServices,
  params: CheckRecoveryRequestStatusParams
): Promise<CheckRecoveryRequestStatusResult> {
  try {
    const { storeService, localStorageService, wsService } = services;
    const { masterPassword } = params;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    if (!login) {
      return {
        success: false,
        error: {
          code: RecoveryApiErrorType.CheckRecoveryStatusFailed,
          message: "Missing login",
        },
      };
    }
    storeService.dispatch(updateMasterPassword(masterPassword));
    const uki = await retrieveRecoveryUkiFromStorage(
      storeService,
      localStorageService,
      masterPassword
    );
    const {
      content: { status, payload, recoveryServerKey },
    } = await wsService.recovery.request({ login, uki });
    if (payload && recoveryServerKey) {
      storeService.dispatch(
        saveRecoverySessionData({
          userServerProtectedSymmetricalKey: payload,
          recoveryServerKeyBase64: recoveryServerKey,
        })
      );
    }
    return {
      success: true,
      response: {
        status,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.CheckRecoveryStatusFailed,
        message: error.message,
      },
    };
  }
}
export async function cancelRecoveryRequest(
  services: CoreServices
): Promise<CancelRecoveryRequestResult> {
  try {
    const { storeService, localStorageService, wsService } = services;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    const masterPassword = masterPasswordSelector(state);
    const uki = await retrieveRecoveryUkiFromStorage(
      storeService,
      localStorageService,
      masterPassword
    );
    await wsService.recovery.cancelRequest({ login, uki });
    await localStorageService.getInstance().cleanRecoveryData();
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.CancelRecoveryRequestFailed,
        message: error.message,
      },
    };
  }
}
export async function checkDoesLocalRecoveryKeyExist(
  services: CoreServices
): Promise<CheckLocalRecoveryKeyResult> {
  try {
    const { localStorageService } = services;
    const localInstance = localStorageService.getInstance();
    const doesRecoveryLocalKeyExist =
      await localInstance.doesRecoveryLocalKeyExist();
    return { success: true, doesExist: doesRecoveryLocalKeyExist };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.CheckLocalRecoveryKeyFailed,
        message: error.message,
      },
    };
  }
}
export async function recoverUserData(
  services: CoreServices,
  params: RecoverUserDataParam
): Promise<RecoverUserDataResult> {
  const { localStorageService, storeService, sessionService } = services;
  const state = storeService.getState();
  const localInstance = localStorageService.getInstance();
  const initialValidation = await validateInitialData(state, localInstance);
  let logHistory = "[Account Recovery PI] - Recover User Data ";
  const addLogHistory = (message: string): void => {
    logHistory += `- ${message} \n`;
  };
  if (!initialValidation.success) {
    return initialValidation;
  }
  const { masterPassword: newPassword } = params;
  try {
    addLogHistory(`Extract PrKey START`);
    const privateKey = await extractPrivateKeyFromRecoveryData(
      services,
      newPassword,
      addLogHistory
    );
    addLogHistory(`Extract PrKey SUCCESS`);
    const { userServerProtectedSymmetricalKey } = recoveryDataSelector(state);
    const cryptoService = await makeAsymmetricEncryption();
    addLogHistory(`Decrypt user protected key START`);
    const serverProtectedSymmetricalKeyBase64 = await cryptoService.decrypt(
      privateKey,
      userServerProtectedSymmetricalKey
    );
    addLogHistory(`Decrypt user protected key SUCCESS`);
    addLogHistory(`Decrypt server protected key START`);
    const recoveryKey = await extractRecoveryKey(
      storeService,
      serverProtectedSymmetricalKeyBase64,
      addLogHistory
    );
    addLogHistory(`Decrypt server protected key SUCCESS`);
    addLogHistory(`Extract local Key START`);
    const localKeyRawClear = await extractLocalKey(
      services,
      recoveryKey,
      addLogHistory
    );
    addLogHistory(`Extract local Key SUCCESS`);
    await prepareLocalDataEncryptorService(services, localKeyRawClear);
    addLogHistory(`Get recovery credentials START`);
    const credential = await localInstance.getRecoverySessionCredential();
    addLogHistory(`Get recovery credentials SUCCESS`);
    const { masterPassword } = JSON.parse(
      atob(credential)
    ) as RecoverySessionCredential;
    const login = userLoginSelector(state);
    const isDataPersisted = PersistData.PERSIST_DATA_YES;
    storeService.dispatch(
      saveRecoverySessionData({ recoveryInProgress: true })
    );
    addLogHistory(`Open session START`);
    const result = await openSessionWithMasterPassword(
      services,
      login,
      masterPassword,
      {
        isDataPersisted,
        serverKey: serverKeySelector(state),
      },
      addLogHistory
    );
    addLogHistory(`Open session SUCCESS`);
    if (result !== LoginResultEnum.LoggedIn) {
      addLogHistory(`Open session SUCCESS but user not logged in`);
      sendExceptionLog({
        message: logHistory,
        funcName: "recoverUserData",
      });
      return recoveryFlowError(
        RecoveryApiErrorType.RecoverUserDataFailed,
        `Unable to login with ${result}`
      );
    }
    storeService.dispatch(
      saveRecoverySessionData({
        recoveryInProgress: false,
        currentPassword: masterPassword,
      })
    );
  } catch (error) {
    addLogHistory(`Recovery failed with error: ${error}`);
    sendExceptionLog({
      message: logHistory,
      funcName: "recoverUserData",
      precisions: error.stack,
    });
    storeService.dispatch(resetRecoverySessionData());
    await sessionService.close(false);
    triggerOpenSessionFailed(
      new Error(AuthenticationCode[AuthenticationCode.WRONG_PASSWORD])
    );
    return recoveryFlowError(
      RecoveryApiErrorType.RecoverUserDataFailed,
      "Unable to decipher data"
    );
  }
  return {
    success: true,
  };
}
