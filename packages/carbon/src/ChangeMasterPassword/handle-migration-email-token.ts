import { ChangeMasterPasswordError } from "@dashlane/hermes";
import {
  ChangeMasterPasswordCode,
  ChangeMasterPasswordResponse,
  ChangeMasterPasswordStepNeeded,
  MigrationToEmailToken,
} from "@dashlane/communication";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import { authTicketInfoSelector, userLoginSelector } from "Session/selectors";
import { emitChangeMasterPasswordStatus } from "ChangeMasterPassword/Api/live";
import {
  cipherPrivateKey,
  cipherTransactionWithNewMP,
  formatTransaction,
  makeReturnErrorObject,
  makeUnexpectedErrorObject,
  returnProperCryptoConfig,
  revertOnError,
} from "ChangeMasterPassword/services";
import {
  confirmMasterPasswordChangeDone,
  EmailTokenVerification,
  isApiError,
  uploadDataForMasterPasswordChange,
} from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import {
  updateMasterPassword,
  updateRemoteKey,
  updateServerKey,
} from "Session/Store/session/actions";
import { logChangeMasterPasswordError } from "./logs";
export const handleMigrationToEmailToken = async (
  services: CoreServices,
  params: MigrationToEmailToken,
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
  const { newPassword, flow, currentPassword } = params;
  const { serverKey } = storeService.getUserSession();
  const state = storeService.getState();
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
  const emptyServerKey = "";
  const cryptoConfig = returnProperCryptoConfig(storeService);
  masterPasswordEncryptorService.setInstance(
    { raw: newPassword },
    emptyServerKey,
    cryptoConfig
  );
  storeService.dispatch(updateMasterPassword(newPassword));
  storeService.dispatch(updateServerKey(emptyServerKey));
  const updateVerification: EmailTokenVerification = {
    type: "email_token",
  };
  storeService.dispatch(updateRemoteKey(null));
  const { authTicket } = authTicketInfoSelector(state);
  const reEncryptedTransactions = await cipherTransactionWithNewMP(
    storeService,
    sessionService,
    masterPasswordEncryptorService,
    clearTransactionsUtf16,
    flow
  );
  const newPrivateKey = await cipherPrivateKey(
    masterPasswordEncryptorService,
    privateKey
  );
  const uploadParams = {
    timestamp,
    transactions: formatTransaction(reEncryptedTransactions),
    updateVerification,
    sharingKeys: {
      publicKey,
      privateKey: newPrivateKey,
    },
    authTicket,
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
        secondaryKey: emptyServerKey,
      },
    });
  return {
    success: true,
    response: {
      reason: ChangeMasterPasswordCode.SUCCESS,
    },
  };
};
