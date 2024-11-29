import { UserLocalDataService } from "Libs/Storage/User";
import { StoreService } from "Store";
import { PersistData } from "Session/types";
import { userABTestsSelector } from "Session/Store/abTests/selector";
export async function persistUserTests(
  storage: UserLocalDataService,
  storeService: StoreService
): Promise<void> {
  const persistData = storeService.getAccountInfo().persistData;
  if (persistData === PersistData.PERSIST_DATA_NO) {
    return Promise.resolve();
  }
  if (storage) {
    await storage.storeUserABTests(
      userABTestsSelector(storeService.getState())
    );
  }
}
