import { CryptoMigrationStatus } from "@dashlane/hermes";
import type { EditTransaction } from "Libs/Backup/Transactions/types";
import {
  getDataForMasterPasswordChange,
  isApiError,
  SharingKeys,
} from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { StoreService } from "Store";
interface DataToMigrate {
  transactions: EditTransaction[];
  sharingKeys: SharingKeys;
  timestamp: number;
}
export async function getDataToMigrate(
  storeService: StoreService,
  logMigrationEvent: (status: CryptoMigrationStatus) => void
): Promise<DataToMigrate> {
  try {
    const state = storeService.getState();
    const login = userLoginSelector(state);
    const response = await getDataForMasterPasswordChange(
      storeService,
      login,
      {}
    );
    if (isApiError(response)) {
      throw new Error(`getDataDoMigrate failed with error: ${response}`);
    }
    return {
      transactions: response.data.transactions,
      sharingKeys: response.data.sharingKeys,
      timestamp: response.timestamp,
    };
  } catch (error) {
    logMigrationEvent(CryptoMigrationStatus.ErrorDownload);
    throw new Error(`getDataDoMigrate failed with error: ${error}`);
  }
}
