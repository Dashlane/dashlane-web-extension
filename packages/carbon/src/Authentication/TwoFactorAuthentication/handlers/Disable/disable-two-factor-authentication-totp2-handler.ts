import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { CoreServices } from "Services";
import { cleanRememberMeStorageData } from "Libs/RememberMe/helpers";
import {
  confirmMasterPasswordChangeDone,
  EmailTokenVerification,
  getDataForMasterPasswordChange,
  isApiError,
  uploadDataForMasterPasswordChange,
} from "Libs/DashlaneApi";
import {
  cipherPrivateKey,
  cipherTransactionWithNewMP,
  deCipherAllTransactions,
  decipherPrivateKey,
  formatTransaction,
  isOtpStatusValid,
  returnProperCryptoConfig,
  revertOnError,
} from "ChangeMasterPassword/services";
import { waitUntilSyncComplete } from "User/Services/wait-until-sync-complete";
import {
  changeMPDone,
  changeMPStart,
} from "Session/Store/changeMasterPassword/actions";
import {
  isRemoteKeyActivatedSelector,
  masterPasswordSelector,
  serverKeySelector,
  userLoginSelector,
} from "Session/selectors";
import {
  updateRemoteKey,
  updateServerKey,
} from "Session/Store/session/actions";
import { storeSessionCredentialForRecovery } from "Recovery/services/recovery-helpers";
import { TwoFactorAuthenticationHandlerResult } from "../types";
export const disableTwoFactorAuthenticationTOTP2Handler = async (
  services: CoreServices,
  authTicket: string
): Promise<TwoFactorAuthenticationHandlerResult> => {
  const {
    moduleClients,
    storeService,
    masterPasswordEncryptorService,
    sessionService,
    storageService,
  } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  try {
    if (!login) {
      throw new Error("2FA Disable Flow - Login not available");
    }
    const isRemoteKeyInitiallyActivated = isRemoteKeyActivatedSelector(state);
    if (isRemoteKeyInitiallyActivated) {
      console.error("Disable 2FA unavailable: RK account");
      throw new Error(
        "2FA Disable Flow - Unavailable due to RemoteKey Account"
      );
    }
    const syncCompleted = await waitUntilSyncComplete(storeService);
    if (!syncCompleted) {
      return {
        success: false,
        error: {
          code: AuthenticationErrorCode.UNKNOWN_SYNC_ERROR,
        },
      };
    }
    storeService.dispatch(changeMPStart());
    await moduleClients.session.commands.prepareLocalDataFlush();
    const response = await getDataForMasterPasswordChange(
      storeService,
      login,
      {}
    );
    if (isApiError(response)) {
      throw new Error(
        "2FA Disable Flow - Unable to getDataForMasterPasswordChange"
      );
    }
    const serverKey = serverKeySelector(state);
    if (!isOtpStatusValid(response.otpStatus, serverKey)) {
      throw new Error("2FA Disable Flow - OTP status is invalid");
    }
    const { timestamp } = response;
    const { transactions, sharingKeys } = response.data;
    const clearTransactionsUtf16 = await deCipherAllTransactions(
      sessionService,
      masterPasswordEncryptorService,
      transactions,
      false
    );
    const currentPassword = storeService.getUserSession().masterPassword;
    const localStorage = services.localStorageService.getInstance();
    const doesLocalKeyExist = await localStorage.doesLocalKeyExist();
    let localKeyRawClear: string | null = null;
    if (doesLocalKeyExist) {
      localKeyRawClear = await localStorage.getLocalKey();
    }
    const { publicKey } = sharingKeys;
    const privateKey = await decipherPrivateKey(
      storeService,
      masterPasswordEncryptorService,
      sharingKeys
    );
    await cleanRememberMeStorageData(
      storeService,
      storageService,
      moduleClients.session
    );
    const emptyServerKey = "";
    const cryptoConfig = returnProperCryptoConfig(storeService);
    masterPasswordEncryptorService.setInstance(
      { raw: currentPassword },
      emptyServerKey,
      cryptoConfig
    );
    storeService.dispatch(updateServerKey(emptyServerKey));
    await services.applicationModulesAccess
      .createClients()
      .session.commands.updateUserSessionKey({
        email: userLoginSelector(storeService.getState()),
        sessionKey: {
          type: "mp",
          masterPassword: masterPasswordSelector(storeService.getState()),
          secondaryKey: emptyServerKey,
        },
      });
    const updateVerification: EmailTokenVerification = {
      type: "email_token",
    };
    storeService.dispatch(updateRemoteKey(null));
    const reEncryptedTransactions = await cipherTransactionWithNewMP(
      storeService,
      sessionService,
      masterPasswordEncryptorService,
      clearTransactionsUtf16,
      null,
      false
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
    const uploadResponse = await uploadDataForMasterPasswordChange(
      storeService,
      login,
      uploadParams
    );
    if (isApiError(uploadResponse)) {
      revertOnError(services, masterPasswordEncryptorService, {
        currentPassword,
        serverKey,
      });
      throw new Error(
        "2FA Disable Flow - Unable to uploadDataForMasterPasswordChange"
      );
    }
    if (localKeyRawClear) {
      await sessionService.getInstance().user.persistLocalKey(localKeyRawClear);
    }
    await moduleClients.session.commands.flushLocalData();
    await storeSessionCredentialForRecovery(
      storeService,
      services.localStorageService
    );
  } catch (error) {
    storeService.dispatch(changeMPDone());
    return {
      success: false,
      error: {
        code: AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
  let logoutRequired = true;
  try {
    const confirmResponse = await confirmMasterPasswordChangeDone(
      storeService,
      login,
      {}
    );
    if (isApiError(confirmResponse)) {
      throw new Error(
        "2FA Disable Flow - Failed to confirmMasterPasswordChangeDone"
      );
    }
    logoutRequired = false;
  } catch (error) {
    throw new Error(
      "2FA Disable Flow - Failed to confirmMasterPasswordChangeDone"
    );
  }
  storeService.dispatch(changeMPDone());
  return {
    success: true,
    logoutRequired,
  };
};
