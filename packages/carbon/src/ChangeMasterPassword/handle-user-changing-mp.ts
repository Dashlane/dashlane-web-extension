import { ChangeMasterPasswordError } from "@dashlane/hermes";
import {
  ChangeMasterPasswordBase,
  ChangeMasterPasswordCode,
  ChangeMasterPasswordResponse,
  ChangeMasterPasswordStepNeeded,
  ChangeMPFlowPath,
  MigrationWithAccountRecoveryKey,
  MigrationWithAdminAssistedRecovery,
} from "@dashlane/communication";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import { userLoginSelector } from "Session/selectors";
import { emitChangeMasterPasswordStatus } from "ChangeMasterPassword/Api/live";
import {
  cipherPrivateKey,
  cipherTransactionWithNewMP,
  extractCurrentPassword,
  formatTransaction,
  makeReturnErrorObject,
  makeUnexpectedErrorObject,
  revertOnError,
} from "ChangeMasterPassword/services";
import {
  confirmMasterPasswordChangeDone,
  isApiError,
  uploadDataForMasterPasswordChange,
  UploadDataForMasterPasswordChangeRequest,
} from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { updateMasterPassword } from "Session/Store/session/actions";
import { logChangeMasterPasswordError } from "./logs";
export const handleUserChangingMP = async (
  services: CoreServices,
  params:
    | ChangeMasterPasswordBase
    | MigrationWithAdminAssistedRecovery
    | MigrationWithAccountRecoveryKey,
  clearTransactionsUtf16: EditTransaction[],
  privateKey: string,
  publicKey: string,
  timestamp: number
): Promise<ChangeMasterPasswordResponse> => {
  const {
    storeService,
    sessionService,
    masterPasswordEncryptorService,
    eventLoggerService,
  } = services;
  const state = storeService.getState();
  const { newPassword, flow } = params;
  const currentPassword = extractCurrentPassword(state, params);
  const { serverKey } = storeService.getUserSession();
  const login = userLoginSelector(state);
  if (!login) {
    logChangeMasterPasswordError(
      eventLoggerService,
      ChangeMasterPasswordError.LoginError
    );
    return makeReturnErrorObject(
      ChangeMasterPasswordCode.UNEXPECTED_STATE,
      flow
    );
  }
  masterPasswordEncryptorService.setInstance({ raw: newPassword }, serverKey);
  storeService.dispatch(updateMasterPassword(newPassword));
  const reEncryptedTransactions = await cipherTransactionWithNewMP(
    storeService,
    sessionService,
    masterPasswordEncryptorService,
    clearTransactionsUtf16
  );
  const newPrivateKey = await cipherPrivateKey(
    masterPasswordEncryptorService,
    privateKey
  );
  const uploadParams: UploadDataForMasterPasswordChangeRequest = {
    timestamp,
    transactions: formatTransaction(reEncryptedTransactions),
    sharingKeys: {
      publicKey,
      privateKey: newPrivateKey,
    },
    uploadReason:
      flow === ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY
        ? "complete_account_recovery"
        : undefined,
  };
  emitChangeMasterPasswordStatus({
    type: ChangeMasterPasswordStepNeeded.UPLOADING,
    value: 95,
  });
  const uploadResponse = await uploadDataForMasterPasswordChange(
    storeService,
    login,
    uploadParams
  );
  if (isApiError(uploadResponse)) {
    logChangeMasterPasswordError(
      eventLoggerService,
      ChangeMasterPasswordError.UploadError
    );
    revertOnError(services, masterPasswordEncryptorService, {
      currentPassword,
      serverKey,
    });
    return makeUnexpectedErrorObject(uploadResponse.message, flow);
  }
  const confirmResponse = await confirmMasterPasswordChangeDone(
    storeService,
    login,
    {}
  );
  if (isApiError(confirmResponse)) {
    logChangeMasterPasswordError(
      eventLoggerService,
      ChangeMasterPasswordError.ConfirmationError
    );
    revertOnError(services, masterPasswordEncryptorService, {
      currentPassword,
      serverKey,
    });
    return makeUnexpectedErrorObject(confirmResponse.message, flow);
  }
  await services.applicationModulesAccess
    .createClients()
    .session.commands.updateUserSessionKey({
      email: userLoginSelector(storeService.getState()),
      sessionKey: {
        type: "mp",
        masterPassword: newPassword,
        secondaryKey: serverKey,
      },
    });
  return {
    success: true,
    response: {
      reason: ChangeMasterPasswordCode.SUCCESS,
    },
  };
};
