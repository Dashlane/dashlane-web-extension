import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { CoreServices } from "Services";
import { cleanRememberMeStorageData } from "Libs/RememberMe/helpers";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import {
  confirmMasterPasswordChangeDone,
  isApiError,
  SharingKeys,
  TOTPLogin,
  uploadDataForMasterPasswordChange,
} from "Libs/DashlaneApi";
import {
  cipherPrivateKey,
  cipherTransactionWithNewMP,
  deCipherAllTransactions,
  decipherPrivateKey,
  formatTransaction,
  returnProperCryptoConfig,
  revertOnError,
} from "ChangeMasterPassword/services";
import {
  isRemoteKeyActivatedSelector,
  masterPasswordSelector,
  userLoginSelector,
} from "Session/selectors";
import { storeSessionCredentialForRecovery } from "Recovery/services/recovery-helpers";
import { changeMPDone } from "Session/Store/changeMasterPassword/actions";
import { updateServerKey } from "Session/Store/session/actions";
import { TwoFactorAuthenticationHandlerResult } from "Authentication/TwoFactorAuthentication/handlers/types";
interface DataToMigrate {
  transactions: EditTransaction[];
  sharingKeys: SharingKeys;
  timestamp: number;
  serverKey: string;
}
const revertChangeMPOnError = (coreServices: CoreServices) => {
  const {
    storeService,
    masterPasswordEncryptorService,
    remoteDataEncryptorService,
  } = coreServices;
  const state = storeService.getState();
  const isRemoteKeyInitiallyActivated = isRemoteKeyActivatedSelector(state);
  const dataEncryptorService = isRemoteKeyInitiallyActivated
    ? remoteDataEncryptorService
    : masterPasswordEncryptorService;
  const currentPassword = storeService.getUserSession().masterPassword;
  revertOnError(coreServices, dataEncryptorService, {
    currentPassword,
    serverKey: "",
  });
};
export const enableTwoFactorAuthenticationTOTP2Handler = async (
  coreServices: CoreServices,
  authTicket: string,
  dataForMasterPasswordChange: DataToMigrate
): Promise<TwoFactorAuthenticationHandlerResult> => {
  const { timestamp, transactions, sharingKeys, serverKey } =
    dataForMasterPasswordChange;
  if (!serverKey) {
    throw new Error("[2FA - Enable] - Empty server key");
  }
  const {
    moduleClients,
    storeService,
    masterPasswordEncryptorService,
    sessionService,
    storageService,
  } = coreServices;
  const state = storeService.getState();
  const isRemoteKeyInitiallyActivated = isRemoteKeyActivatedSelector(state);
  if (isRemoteKeyInitiallyActivated) {
    console.error("Enable 2FA unavailable: RK account");
    return {
      success: false,
      error: {
        code: AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
  await moduleClients.session.commands.prepareLocalDataFlush();
  const login = userLoginSelector(state);
  if (!login) {
    return {
      success: false,
      error: {
        code: AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
  const localStorage = coreServices.localStorageService.getInstance();
  const doesLocalKeyExist = await localStorage.doesLocalKeyExist();
  let localKeyRawClear: string | null = null;
  if (doesLocalKeyExist) {
    localKeyRawClear = await localStorage.getLocalKey();
  }
  try {
    const clearTransactionsUtf16 = await deCipherAllTransactions(
      sessionService,
      masterPasswordEncryptorService,
      transactions,
      false
    );
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
    const updateVerification: TOTPLogin = {
      type: "totp_login",
      serverKey,
    };
    const cryptoConfig = returnProperCryptoConfig(storeService);
    const currentPassword = storeService.getUserSession().masterPassword;
    masterPasswordEncryptorService.setInstance(
      { raw: currentPassword },
      serverKey,
      cryptoConfig
    );
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
      throw new Error(
        "2FA Enable Flow - Unable to uploadDataForMasterPasswordChange"
      );
    }
    storeService.dispatch(updateServerKey(serverKey));
    await moduleClients.session.commands.updateUserSessionKey({
      email: userLoginSelector(storeService.getState()),
      sessionKey: {
        type: "mp",
        masterPassword: masterPasswordSelector(storeService.getState()),
        secondaryKey: serverKey,
      },
    });
    if (localKeyRawClear) {
      await sessionService.getInstance().user.persistLocalKey(localKeyRawClear);
    }
    await moduleClients.session.commands.flushLocalData();
    await storeSessionCredentialForRecovery(
      storeService,
      coreServices.localStorageService
    );
    await moduleClients.pinCode.commands.deactivate();
  } catch (error) {
    revertChangeMPOnError(coreServices);
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
        "2FA Enable Flow - Failed to confirmMasterPasswordChangeDone"
      );
    }
    logoutRequired = false;
  } catch (error) {}
  storeService.dispatch(changeMPDone());
  return {
    success: true,
    logoutRequired,
  };
};
