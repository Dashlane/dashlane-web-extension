import {
  ActivateAccountRecoveryResult,
  DeactivateAccountRecoveryResult,
  IsRecoveryRequestPendingResult,
  RecoveryApiErrorType,
} from "@dashlane/communication";
import { deflateUtf16 } from "Libs/CryptoCenter";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { WSService } from "Libs/WS";
import {
  encryptRecoveryData,
  getAdminProtectedSymmetricalKeys,
  getRecoveryKey,
  getSetupRequisitesData,
  isARAvailableForUser,
  resetAdminProtectedSymmetricalKeys,
  sendAdminProtectedSymmetricalKeys,
  storeSessionCredentialForRecovery,
} from "Recovery/services/recovery-helpers";
import { CoreServices } from "Services";
import { sessionForceSync } from "Session/SessionController";
import { accountRecoveryOptInSelector } from "Session/selectors";
import { editPersonalSettings } from "Session/Store/personalSettings/actions";
import { StoreService } from "Store";
export async function activateAccountRecovery(
  services: CoreServices
): Promise<ActivateAccountRecoveryResult> {
  const { sessionService, storeService, localStorageService, wsService } =
    services;
  const state = storeService.getState();
  const isARAvailable = isARAvailableForUser(state);
  if (!isARAvailable) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.AccountRecoveryNotAvailableError,
      },
    };
  }
  const accountRecoveryOptIn = accountRecoveryOptInSelector(state);
  if (!accountRecoveryOptIn) {
    storeService.dispatch(editPersonalSettings({ RecoveryOptIn: true }));
  }
  try {
    await setupAccountRecoveryForDevice(
      storeService,
      localStorageService,
      wsService
    );
    await sessionService.getInstance().user.persistPersonalSettings();
    await sessionForceSync(sessionService);
  } catch (error) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.RecoverySetupFailed,
        message: error.message,
      },
    };
  }
  return {
    success: true,
  };
}
export async function setupAccountRecoveryForDevice(
  storeService: StoreService,
  localStorageService: LocalStorageService,
  wsService: WSService
) {
  const {
    hash,
    recipients,
    recoveryServerKey: recoveryServerKeyB64,
  } = await getSetupRequisitesData(storeService, wsService);
  const {
    recoveryKeyBufferClear,
    recoveryKeyBase64Clear,
    recoveryKeyRawClear,
  } = await getRecoveryKey(storeService);
  const localStorage = localStorageService.getInstance();
  const localKeyRawClear = await localStorage.getLocalKey();
  const localKeyBuffer = deflateUtf16(localKeyRawClear);
  const localKeyRecoveryEncrypted = await encryptRecoveryData({
    storeService,
    encryptionKey: recoveryKeyRawClear,
    data: localKeyBuffer,
  });
  localStorageService
    .getInstance()
    .storeRecoveryLocalKey(localKeyRecoveryEncrypted);
  const recoveryServerKeyRawClear = atob(recoveryServerKeyB64);
  const serverProtectedSymmetricalKey = await encryptRecoveryData({
    storeService,
    encryptionKey: recoveryServerKeyRawClear,
    data: recoveryKeyBufferClear,
  });
  const adminProtectedSymmetricalKeys = await getAdminProtectedSymmetricalKeys(
    recipients,
    serverProtectedSymmetricalKey
  );
  await sendAdminProtectedSymmetricalKeys(
    storeService,
    wsService,
    adminProtectedSymmetricalKeys
  );
  const newSettings = {
    RecoveryHash: hash,
    RecoveryKey: recoveryKeyBase64Clear,
  };
  storeService.dispatch(editPersonalSettings(newSettings));
  await storeSessionCredentialForRecovery(storeService, localStorageService);
}
export async function deactivateAccountRecovery(
  services: CoreServices
): Promise<DeactivateAccountRecoveryResult> {
  const { sessionService, storeService, localStorageService, wsService } =
    services;
  const state = storeService.getState();
  const isARAvailable = isARAvailableForUser(state);
  if (!isARAvailable) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.AccountRecoveryNotAvailableError,
      },
    };
  }
  const emptySettings = {
    RecoveryKey: "",
    RecoveryHash: "",
    RecoveryOptIn: false,
  };
  try {
    storeService.dispatch(editPersonalSettings(emptySettings));
    await sessionService.getInstance().user.persistPersonalSettings();
    await localStorageService.getInstance().cleanRecoverySetupData();
    await resetAdminProtectedSymmetricalKeys(storeService, wsService);
  } catch (error) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.RecoveryDeactivationFailed,
        message: error.message,
      },
    };
  }
  return {
    success: true,
  };
}
export async function isRecoveryRequestPending(
  services: CoreServices
): Promise<IsRecoveryRequestPendingResult> {
  try {
    const isPending = await services.localStorageService
      .getInstance()
      .doesRecoveryDataExist();
    return {
      success: true,
      response: isPending,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: RecoveryApiErrorType.IsRecoveryRequestPendingFailed,
        message: error,
      },
    };
  }
}
