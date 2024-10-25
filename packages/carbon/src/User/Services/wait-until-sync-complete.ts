import { StoreService } from "Store";
import { isSyncInProgress } from "User/Services/UserSessionService";
export const waitUntilSyncComplete = async (
  storeService: StoreService
): Promise<boolean> => {
  if (isSyncInProgress(storeService) === false) {
    return true;
  }
  const syncIntervalTimeMs = 1000;
  const syncIntervalTimeLimit = 60000;
  return new Promise((resolve) => {
    const startTime = Date.now();
    const syncWaitInterval = setInterval(() => {
      if (isSyncInProgress(storeService) === false) {
        clearInterval(syncWaitInterval);
        return resolve(true);
      }
      if (Date.now() - startTime > syncIntervalTimeLimit) {
        return resolve(false);
      }
    }, syncIntervalTimeMs);
  });
};
