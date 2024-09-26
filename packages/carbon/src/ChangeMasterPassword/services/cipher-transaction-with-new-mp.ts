import {
  ChangeMasterPasswordStepNeeded,
  ChangeMPFlowPath,
} from "@dashlane/communication";
import {
  getBaseModelFromXml,
  initializeProgress,
  returnProperCryptoConfig,
  returnProperSettingContent,
} from "ChangeMasterPassword/services";
import { asyncMapLimit } from "Helpers/async-map-limit";
import { encryptSingleTransaction } from "Libs/Backup/BackupCrypt/singleTransactions";
import { getTransactionXml } from "Libs/Backup/Transactions";
import { EditTransaction } from "Libs/Backup/Transactions/types";
import { EncryptOptions } from "Libs/CryptoCenter/types";
import { CRYPTO_NODERIVATION_HMAC64 } from "Libs/CryptoCenter/constant";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { getRandomValues } from "Libs/CryptoCenter/Helpers/WebCryptoWrapper";
import { editPersonalSettings } from "Session/Store/personalSettings/actions";
import { StoreService } from "Store/index";
import { SessionService } from "User/Services/types";
export const cipherTransactionWithNewMP = async (
  storeService: StoreService,
  sessionService: SessionService,
  dataEncryptorService: DataEncryptorService,
  clearTransactionsUtf16: EditTransaction[],
  flow?: ChangeMPFlowPath,
  showProgress = true
): Promise<EditTransaction[]> => {
  const { announce } = sessionService.getInstance().user.getSyncArgs();
  const xmlTransactions = await Promise.all(
    clearTransactionsUtf16.map(async (item) => {
      if (flow && item.type === "SETTINGS" && item.content) {
        const clearSettings = {
          ...item,
          content: await getBaseModelFromXml(announce, item.content),
        };
        switch (flow) {
          case ChangeMPFlowPath.MP_TO_SSO:
            const noDerivationSettings = {
              ...clearSettings.content,
              CryptoUserPayload: CRYPTO_NODERIVATION_HMAC64,
            };
            return {
              ...clearSettings,
              content: getTransactionXml(noDerivationSettings),
            };
          case ChangeMPFlowPath.SSO_TO_MP:
            const encryptOptions: EncryptOptions = {
              forceSalt: getRandomValues(16),
              cryptoConfig: returnProperCryptoConfig(storeService),
            };
            const settingsContent = returnProperSettingContent(
              storeService,
              clearSettings,
              encryptOptions
            );
            storeService.dispatch(editPersonalSettings(settingsContent));
            return {
              ...item,
              content: getTransactionXml(settingsContent),
            };
          case ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY:
          case ChangeMPFlowPath.ACCOUNT_RECOVERY_KEY:
          case ChangeMPFlowPath.USER_CHANGING_MP:
          case ChangeMPFlowPath.TO_EMAIL_TOKEN:
          default:
            break;
        }
      }
      return item;
    })
  );
  const nbrTransaction = xmlTransactions.length;
  const batchSize = 100;
  const progress = showProgress
    ? initializeProgress(
        ChangeMasterPasswordStepNeeded.ENCRYPTING,
        batchSize,
        nbrTransaction
      )
    : null;
  const processTransaction = async (
    clearTransaction: EditTransaction,
    callback: (value: EditTransaction) => void
  ) => {
    if (progress) {
      progress();
    }
    callback(
      await encryptSingleTransaction(dataEncryptorService, clearTransaction)
    );
  };
  return await new Promise((resolve) => {
    asyncMapLimit(xmlTransactions, processTransaction, resolve, batchSize);
  });
};
