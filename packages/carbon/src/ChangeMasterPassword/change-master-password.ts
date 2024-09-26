import {
  ChangeMasterPasswordCode,
  ChangeMasterPasswordParams,
  ChangeMasterPasswordResponse,
  ChangeMasterPasswordStepNeeded,
  ChangeMPFlowPath,
} from "@dashlane/communication";
import { emitChangeMasterPasswordStatus } from "ChangeMasterPassword/Api/live";
import {
  deCipherAllTransactions,
  decipherPrivateKey,
  extractCurrentPassword,
  isOtpStatusValid,
  logoutUserOnError,
  makeReturnErrorObject,
  makeUnexpectedErrorObject,
  preValidationForChangeMP,
  resetMigrationState,
  revertOnError,
} from "ChangeMasterPassword/services";
import { handleMigrationToEmailToken } from "ChangeMasterPassword/handle-migration-email-token";
import { handleMigrationMPtoSso } from "ChangeMasterPassword/handle-migration-mp-to-sso";
import { handleMigrationSSOtoMP } from "ChangeMasterPassword/handle-migration-sso-to-mp";
import { handleUserChangingMP } from "ChangeMasterPassword/handle-user-changing-mp";
import { getDataForMasterPasswordChange, isApiError } from "Libs/DashlaneApi";
import { sessionDidOpen } from "Login/LoginController";
import { storeSessionCredentialForRecovery } from "Recovery/services/recovery-helpers";
import { CoreServices } from "Services";
import {
  isRemoteKeyActivatedSelector,
  userLoginSelector,
} from "Session/selectors";
import {
  changeMPDone,
  changeMPStart,
} from "Session/Store/changeMasterPassword/actions";
import { cleanRememberMeStorageData } from "Libs/RememberMe/helpers";
import { ChangeMasterPasswordError, Trigger } from "@dashlane/hermes";
import {
  logChangeMasterPasswordComplete,
  logChangeMasterPasswordError,
  logUserDeleteAccountRecoveryKey,
} from "./logs";
import { firstValueFrom } from "rxjs";
import { isSuccess } from "@dashlane/framework-types";
import { CarbonError } from "Libs/Error";
import { sendExceptionLog } from "Logs/Exception";
import { deactivateAccountRecoveryKey } from "Libs/DashlaneApi/services/account-recovery-key/deactivate";
import { editPersonalSettings } from "Session/Store/personalSettings/actions";
export const changeMasterPassword = async (
  services: CoreServices,
  params: ChangeMasterPasswordParams
): Promise<ChangeMasterPasswordResponse> => {
  const {
    applicationModulesAccess,
    storeService,
    masterPasswordEncryptorService,
    remoteDataEncryptorService,
    sessionService,
    localStorageService,
    storageService,
    eventLoggerService,
    moduleClients,
  } = services;
  const {
    queries: { isMasterPasswordLeaked, isMasterPasswordWeak },
    commands: { temporaryResetMasterPasswordLeaked },
  } = moduleClients.masterPasswordSecurity;
  const { flow } = params;
  const validation = await preValidationForChangeMP(services, params);
  if (validation.success === false) {
    return validation;
  }
  const state = storeService.getState();
  const isRemoteKeyInitiallyActivated = isRemoteKeyActivatedSelector(state);
  const dataEncryptorService = isRemoteKeyInitiallyActivated
    ? remoteDataEncryptorService
    : masterPasswordEncryptorService;
  emitChangeMasterPasswordStatus({
    type: ChangeMasterPasswordStepNeeded.DOWNLOAD,
    value: 10,
  });
  const login = userLoginSelector(state);
  if (!login) {
    return makeReturnErrorObject(
      ChangeMasterPasswordCode.UNEXPECTED_STATE,
      flow
    );
  }
  try {
    await moduleClients.session.commands.prepareLocalDataFlush();
    storeService.dispatch(changeMPStart());
  } catch (error) {
    const prepareLocalDataFlushError = CarbonError.fromAnyError(error)
      .addContextInfo("CHANGE_MASTER_PASSWORD", "prepareLocalDataFlushError")
      .addAdditionalInfo({
        comment: "Failed to prepare local data on graphene",
      });
    void sendExceptionLog({ error: prepareLocalDataFlushError });
    throw error;
  }
  const response = await getDataForMasterPasswordChange(
    storeService,
    login,
    {}
  );
  if (isApiError(response)) {
    logChangeMasterPasswordError(
      eventLoggerService,
      ChangeMasterPasswordError.DownloadError
    );
    storeService.dispatch(changeMPDone());
    return makeUnexpectedErrorObject(response.message, flow);
  }
  const { serverKey } = storeService.getUserSession();
  if (!isOtpStatusValid(response.otpStatus, serverKey)) {
    logChangeMasterPasswordError(
      eventLoggerService,
      ChangeMasterPasswordError.LoginError
    );
    storeService.dispatch(changeMPDone());
    return makeReturnErrorObject(ChangeMasterPasswordCode.OTP_PROBLEM, flow);
  }
  const { timestamp } = response;
  const { transactions, sharingKeys } = response.data;
  try {
    const clearTransactionsUtf16 = await deCipherAllTransactions(
      sessionService,
      dataEncryptorService,
      transactions
    );
    const localStorage = localStorageService.getInstance();
    const doesLocalKeyExist = await localStorage.doesLocalKeyExist();
    let localKeyRawClear: string | null = null;
    if (doesLocalKeyExist) {
      localKeyRawClear = await localStorage.getLocalKey();
    }
    const { publicKey } = sharingKeys;
    const privateKey = await decipherPrivateKey(
      storeService,
      dataEncryptorService,
      sharingKeys
    );
    await cleanRememberMeStorageData(
      storeService,
      storageService,
      moduleClients.session
    );
    let apiFlow;
    switch (params.flow) {
      case ChangeMPFlowPath.MP_TO_SSO:
        apiFlow = await handleMigrationMPtoSso(
          services,
          params,
          clearTransactionsUtf16,
          privateKey,
          publicKey,
          timestamp
        );
        break;
      case ChangeMPFlowPath.SSO_TO_MP:
        apiFlow = await handleMigrationSSOtoMP(
          services,
          params,
          clearTransactionsUtf16,
          privateKey,
          publicKey,
          timestamp
        );
        break;
      case ChangeMPFlowPath.TO_EMAIL_TOKEN:
        apiFlow = await handleMigrationToEmailToken(
          services,
          params,
          clearTransactionsUtf16,
          privateKey,
          publicKey,
          timestamp
        );
        break;
      case ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY:
      case ChangeMPFlowPath.ACCOUNT_RECOVERY_KEY:
      case ChangeMPFlowPath.USER_CHANGING_MP:
      default:
        apiFlow = await handleUserChangingMP(
          services,
          params,
          clearTransactionsUtf16,
          privateKey,
          publicKey,
          timestamp
        );
    }
    if (!apiFlow.success) {
      logChangeMasterPasswordError(
        eventLoggerService,
        ChangeMasterPasswordError.UnknownError
      );
      storeService.dispatch(changeMPDone());
      return apiFlow;
    }
    await moduleClients.session.commands.flushLocalData();
    const isAccountRecoveryKeyEnabled = Boolean(
      storeService.getPersonalSettings().AccountRecoveryKey
    );
    try {
      await applicationModulesAccess
        .createClients()
        .pinCode.commands.deactivate();
    } catch (error) {
      const augmentedError = CarbonError.fromAnyError(error)
        .addContextInfo("CHANGE_MASTER_PASSWORD", "deactivatePinCode")
        .addAdditionalInfo({
          comment: "Failed to deactivate pin code after successful mp change",
        });
      await sendExceptionLog({ error: augmentedError });
    }
    try {
      if (isAccountRecoveryKeyEnabled) {
        await deactivateAccountRecoveryKey(storeService, login, {
          reason: "VAULT_KEY_CHANGE",
        });
        logUserDeleteAccountRecoveryKey(eventLoggerService);
        services.storeService.dispatch(
          editPersonalSettings({
            AccountRecoveryKey: undefined,
            AccountRecoveryKeyId: undefined,
          })
        );
      }
    } catch (error) {
      const deactivateRecoveryKeyError = CarbonError.fromAnyError(error)
        .addContextInfo("CHANGE_MASTER_PASSWORD", "deactivateRecoveryKey")
        .addAdditionalInfo({
          comment:
            "Failed to deactivate recovery key after successful mp change",
        });
      await sendExceptionLog({ error: deactivateRecoveryKeyError });
    }
    if (localKeyRawClear) {
      await sessionService.getInstance().user.persistLocalKey(localKeyRawClear);
    }
    await storeSessionCredentialForRecovery(storeService, localStorageService);
    emitChangeMasterPasswordStatus({
      type: ChangeMasterPasswordStepNeeded.DONE,
      value: 100,
    });
    await resetMigrationState(services, flow);
    if (
      flow === ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY ||
      flow === ChangeMPFlowPath.MP_TO_SSO ||
      flow === ChangeMPFlowPath.SSO_TO_MP
    ) {
      await sessionDidOpen(services);
    } else if (isAccountRecoveryKeyEnabled) {
      await services.sessionService
        .getInstance()
        .user.attemptSync(Trigger.ChangeMasterPassword);
    }
    let isMasterPasswordLeakedResult;
    try {
      isMasterPasswordLeakedResult = await firstValueFrom(
        isMasterPasswordLeaked()
      );
    } catch (error) {
      const isMasterPasswordLeakedError = CarbonError.fromAnyError(error)
        .addContextInfo("CHANGE_MASTER_PASSWORD", "isMasterPasswordLeakedError")
        .addAdditionalInfo({
          comment: "Failed to retrieve value from isMasterPasswordLeaked",
        });
      void sendExceptionLog({ error: isMasterPasswordLeakedError });
      throw error;
    }
    let isMasterPasswordWeakResult;
    try {
      isMasterPasswordWeakResult = await firstValueFrom(isMasterPasswordWeak());
    } catch (error) {
      const isMasterPasswordWeakError = CarbonError.fromAnyError(error)
        .addContextInfo("CHANGE_MASTER_PASSWORD", "isMasterPasswordWeakError")
        .addAdditionalInfo({
          comment: "Failed to retrieve value from isMasterPasswordWeak",
        });
      void sendExceptionLog({ error: isMasterPasswordWeakError });
      throw error;
    }
    const wasLeaked = isSuccess(isMasterPasswordLeakedResult)
      ? isMasterPasswordLeakedResult.data
      : false;
    const wasWeak = isSuccess(isMasterPasswordWeakResult)
      ? isMasterPasswordWeakResult.data
      : false;
    logChangeMasterPasswordComplete(eventLoggerService, wasLeaked, wasWeak);
    storeService.dispatch(changeMPDone());
    temporaryResetMasterPasswordLeaked(undefined);
    const {
      commands: { temporarySendMasterPasswordChangedEvent },
    } = applicationModulesAccess.createClients().changeMasterPassword;
    temporarySendMasterPasswordChangedEvent(undefined);
    return {
      success: true,
      response: {
        reason: ChangeMasterPasswordCode.SUCCESS,
      },
    };
  } catch (error) {
    logChangeMasterPasswordError(
      eventLoggerService,
      ChangeMasterPasswordError.UnknownError
    );
    if (
      params.flow !== ChangeMPFlowPath.MP_TO_SSO &&
      params.flow !== ChangeMPFlowPath.SSO_TO_MP
    ) {
      const currentPassword = extractCurrentPassword(state, params);
      revertOnError(services, dataEncryptorService, {
        currentPassword,
        serverKey,
      });
    } else {
      logoutUserOnError(services);
    }
    return makeUnexpectedErrorObject(error.message, flow);
  }
};
