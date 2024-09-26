import { ChangeMasterPasswordStepNeeded } from "@dashlane/communication";
import {
  EditTransaction,
  TransactionType,
} from "Libs/Backup/Transactions/types";
import { initializeProgress } from "ChangeMasterPassword/services";
import { asyncMapLimit } from "Helpers/async-map-limit";
import { decryptTransactionContent } from "Libs/Backup/BackupCrypt/singleTransactions";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { SessionService } from "User/Services/types";
import { sanitizeTransactions } from "Helpers/sanitize-transactions";
import { sendExceptionLog } from "Logs/Exception";
import { CarbonError } from "Libs/Error";
export const deCipherAllTransactions = async (
  sessionService: SessionService,
  dataEncryptorService: DataEncryptorService,
  transactions: EditTransaction[],
  showProgress = true
): Promise<EditTransaction[]> => {
  const { announce } = sessionService.getInstance().user.getSyncArgs();
  const cryptoCenterService = dataEncryptorService.getInstance();
  const nbrTransaction = transactions.length;
  const batchSize = 100;
  const progress = showProgress
    ? initializeProgress(
        ChangeMasterPasswordStepNeeded.DECRYPTING,
        batchSize,
        nbrTransaction
      )
    : null;
  const processTransaction = async (
    transaction: EditTransaction,
    callback: (value: EditTransaction | null) => void
  ) => {
    if (progress) {
      progress();
    }
    if (transaction.content) {
      try {
        const transactionContent = await decryptTransactionContent(
          cryptoCenterService,
          announce,
          transaction
        );
        callback({ ...transaction, content: transactionContent });
      } catch (error) {
        if (transaction.type === TransactionType.SETTINGS) {
          const augmentedError = CarbonError.fromAnyError(error)
            .addContextInfo("CHANGE_MP", "decipherAllTransactions")
            .addAdditionalInfo({
              comment:
                error.message ??
                `Transaction of type ${transaction.type} couldn't be decrypted`,
            });
          sendExceptionLog({ error: augmentedError });
          throw error;
        }
        callback(null);
      }
    } else {
      callback(transaction);
    }
  };
  const processedTransactions: EditTransaction[] = await new Promise(
    (resolve) => {
      asyncMapLimit(transactions, processTransaction, resolve, batchSize);
    }
  );
  return sanitizeTransactions(processedTransactions);
};
