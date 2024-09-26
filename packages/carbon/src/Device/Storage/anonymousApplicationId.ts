import { v4 as uuid } from "uuid";
import { getWindowLocalStorage } from "Helpers/window-localStorage";
import { AsyncStorage, StorageService } from "Libs/Storage/types";
import { StoreService } from "Store";
import { log } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { loadedAnonymousComputerId } from "Session/Store/platform/actions";
export const ANONYMOUS_APPLICATION_ID_KEY = "anonymousApplicationId";
async function getAndMigrateLegacyAnonymousApplicationId(
  asyncStorage: AsyncStorage
) {
  const windowLocalStorage = getWindowLocalStorage();
  if (!windowLocalStorage) {
    return null;
  }
  const legacyAnonymousApplicationId = windowLocalStorage.getItem(
    ANONYMOUS_APPLICATION_ID_KEY
  );
  if (!legacyAnonymousApplicationId) {
    return null;
  }
  const anonymousApplicationId = legacyAnonymousApplicationId.replaceAll(
    '"',
    ""
  );
  await asyncStorage.writeItem(
    ANONYMOUS_APPLICATION_ID_KEY,
    anonymousApplicationId
  );
  return anonymousApplicationId;
}
async function getAnonymousApplicationId(
  storageService: StorageService
): Promise<string> {
  const asyncStorage = storageService.getLocalStorage();
  const doesAnonymousApplicationIdExists = await asyncStorage.itemExists(
    ANONYMOUS_APPLICATION_ID_KEY
  );
  if (doesAnonymousApplicationIdExists) {
    const anonymousApplicationId = await asyncStorage.readItem(
      ANONYMOUS_APPLICATION_ID_KEY
    );
    if (typeof anonymousApplicationId === "string") {
      return anonymousApplicationId;
    }
  }
  const legacyAnonymousApplicationId =
    await getAndMigrateLegacyAnonymousApplicationId(asyncStorage);
  return legacyAnonymousApplicationId ? legacyAnonymousApplicationId : uuid();
}
export const loadAnonymousApplicationId = async (
  storageService: StorageService,
  storeService: StoreService
): Promise<void> => {
  log({ message: "Load anonymousApplicationId" });
  try {
    const anonymousApplicationId = await getAnonymousApplicationId(
      storageService
    );
    storeService.dispatch(loadedAnonymousComputerId(anonymousApplicationId));
  } catch (error) {
    const errorMessage = `An error occurred when trying to load anonymousApplicationId ${error} `;
    sendExceptionLog({
      message: errorMessage,
    });
  }
};
