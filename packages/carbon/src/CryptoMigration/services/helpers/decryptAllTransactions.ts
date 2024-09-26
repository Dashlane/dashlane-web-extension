import { decryptTransactionContent } from "Libs/Backup/BackupCrypt/singleTransactions";
import {
  EditTransaction,
  TransactionType,
} from "Libs/Backup/Transactions/types";
import type { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import type { SessionService } from "User/Services/types";
export async function decryptAllTransactions(
  transactions: EditTransaction[],
  dataEncryptorService: DataEncryptorService,
  sessionService: SessionService
): Promise<EditTransaction[]> {
  const { announce } = sessionService.getInstance().user.getSyncArgs();
  const decryptAllTransactionsPromises = transactions.map(
    async (transaction): Promise<EditTransaction> => ({
      ...transaction,
      content: await decryptTransactionContent(
        dataEncryptorService.getInstance(),
        announce,
        transaction
      ).catch((error) => {
        if (transaction.type !== TransactionType.SETTINGS) {
          return "";
        }
        throw error;
      }),
    })
  );
  return (await Promise.all(decryptAllTransactionsPromises)).filter(
    (transaction) => !!transaction.content
  );
}
