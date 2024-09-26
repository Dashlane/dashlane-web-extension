import { ChangeMasterPasswordError } from "@dashlane/hermes";
import {
  ChangeMasterPasswordCode,
  ChangeMasterPasswordResponse,
  ChangeMasterPasswordStepNeeded,
  MigrationMPToSso,
} from "@dashlane/communication";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import { prepareRemoteDataEncryptionServices } from "Account/Creation/services/createSSOAccount";
import { authTicketInfoSelector, userLoginSelector } from "Session/selectors";
import { emitChangeMasterPasswordStatus } from "ChangeMasterPassword/Api/live";
import {
  cipherPrivateKey,
  cipherTransactionWithNewMP,
  formatTransaction,
  logoutUserOnError,
  makeReturnErrorObject,
  makeUnexpectedErrorObject,
} from "ChangeMasterPassword/services";
import {
  confirmMasterPasswordChangeDone,
  isApiError,
  SsoVerificationSetting,
  uploadDataForMasterPasswordChange,
} from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { logChangeMasterPasswordError } from "./logs";
export const handleMigrationMPtoSso = async (
  services: CoreServices,
  params: MigrationMPToSso,
  clearTransactionsUtf16: EditTransaction[],
  privateKey: string,
  publicKey: string,
  timestamp: number
): Promise<ChangeMasterPasswordResponse> => {
  const {
    storeService,
    sessionService,
    remoteDataEncryptorService,
    eventLoggerService,
  } = services;
  const { newPassword, flow } = params;
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
  const { remoteKey, serverKeyBase64 } =
    await prepareRemoteDataEncryptionServices(services, newPassword);
  const remoteKeys = [remoteKey];
  const updateVerification: SsoVerificationSetting = {
    type: "sso",
    ssoServerKey: serverKeyBase64,
  };
  const { authTicket } = authTicketInfoSelector(state);
  const reEncryptedTransactions = await cipherTransactionWithNewMP(
    storeService,
    sessionService,
    remoteDataEncryptorService,
    clearTransactionsUtf16,
    flow
  );
  const newPrivateKey = await cipherPrivateKey(
    remoteDataEncryptorService,
    privateKey
  );
  const uploadParams = {
    timestamp,
    transactions: formatTransaction(reEncryptedTransactions),
    remoteKeys,
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
    logoutUserOnError(services);
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
    logoutUserOnError(services);
    return makeUnexpectedErrorObject(confirmResponse.message, flow);
  }
  await services.applicationModulesAccess
    .createClients()
    .session.commands.updateUserSessionKey({
      email: userLoginSelector(storeService.getState()),
      sessionKey: {
        type: "sso",
        ssoKey: "",
      },
    });
  return {
    success: true,
    response: {
      reason: ChangeMasterPasswordCode.SUCCESS,
    },
  };
};
