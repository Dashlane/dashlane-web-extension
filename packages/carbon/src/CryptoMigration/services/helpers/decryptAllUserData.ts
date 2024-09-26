import { EditTransaction } from "Libs/Backup/Transactions/types";
import { decipherPrivateKey } from "ChangeMasterPassword/services";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { SharingKeys } from "Libs/DashlaneApi";
import { StoreService } from "Store";
import { SessionService } from "User/Services/types";
import { decryptAllTransactions } from "./decryptAllTransactions";
interface DecryptAllUserDataParams {
  transactions: EditTransaction[];
  sharingKeys: SharingKeys;
}
export async function decryptAllUserData(
  sessionService: SessionService,
  storeService: StoreService,
  dataEncryptorService: DataEncryptorService,
  { transactions, sharingKeys }: DecryptAllUserDataParams
): Promise<{
  clearTransactions: EditTransaction[];
  clearPrivateKey: string;
}> {
  try {
    const clearTransactions = await decryptAllTransactions(
      transactions,
      dataEncryptorService,
      sessionService
    );
    const clearPrivateKey = await decipherPrivateKey(
      storeService,
      dataEncryptorService,
      sharingKeys
    );
    return {
      clearTransactions,
      clearPrivateKey,
    };
  } catch (error) {
    throw new Error(`decipherAllUserData failed with error: ${error}`);
  }
}
