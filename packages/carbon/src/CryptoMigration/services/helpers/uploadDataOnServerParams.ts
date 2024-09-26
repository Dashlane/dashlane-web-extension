import { CryptoMigrationStatus } from "@dashlane/hermes";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import { formatTransaction } from "ChangeMasterPassword/services";
import { isApiError, SharingKeys } from "Libs/DashlaneApi";
import { uploadDataForCryptoChange } from "Libs/DashlaneApi/services/sync/upload-data-for-crypto-change";
import { userLoginSelector } from "Session/selectors";
import { StoreService } from "Store";
interface UploadDataOnServerParams {
  timestamp: number;
  transactions: EditTransaction[];
  sharingKeys: SharingKeys;
}
export async function uploadDataOnServer(
  storeService: StoreService,
  data: UploadDataOnServerParams,
  logCryptoMigrationEvent: (status: CryptoMigrationStatus) => void
): Promise<void> {
  try {
    const state = storeService.getState();
    const login = userLoginSelector(state);
    const formattedData = {
      ...data,
      transactions: formatTransaction(data.transactions),
    };
    const response = await uploadDataForCryptoChange(
      storeService,
      login,
      formattedData
    );
    if (isApiError(response)) {
      throw new Error(
        `uploadDataForCryptoChange failed with error: ${response}`
      );
    }
  } catch (error) {
    logCryptoMigrationEvent(CryptoMigrationStatus.ErrorUpload);
    throw new Error(`uploadDataForCryptoChange failed with error: ${error}`);
  }
}
