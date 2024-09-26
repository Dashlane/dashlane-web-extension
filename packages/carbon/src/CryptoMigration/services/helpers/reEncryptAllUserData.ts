import { CryptoMigrationStatus } from "@dashlane/hermes";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import { cipherPrivateKey } from "ChangeMasterPassword/services";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { encryptSingleTransaction } from "Libs/Backup/BackupCrypt/singleTransactions";
interface ReEncryptAllUserDataParams {
  clearTransactions: EditTransaction[];
  clearPrivateKey: string;
}
export async function reEncryptAllUserData(
  dataEncryptorService: DataEncryptorService,
  { clearTransactions, clearPrivateKey }: ReEncryptAllUserDataParams,
  logCryptoMigrationEvent: (status: CryptoMigrationStatus) => void
): Promise<{
  encryptedTransactions: EditTransaction[];
  encryptedPrivateKey: string;
}> {
  try {
    const encryptAllTransactionsPromises = clearTransactions.map(
      (transaction) =>
        encryptSingleTransaction(dataEncryptorService, transaction)
    );
    const encryptedTransactions = await Promise.all(
      encryptAllTransactionsPromises
    );
    const encryptedPrivateKey = await cipherPrivateKey(
      dataEncryptorService,
      clearPrivateKey
    );
    return { encryptedTransactions, encryptedPrivateKey };
  } catch (error) {
    logCryptoMigrationEvent(CryptoMigrationStatus.ErrorReencryption);
    throw new Error(`reEncryptAllUserData failed with error: ${error}`);
  }
}
