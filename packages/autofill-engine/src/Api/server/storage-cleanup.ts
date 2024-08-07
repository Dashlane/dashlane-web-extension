import {
  storageLocalGet,
  storageLocalRemove,
} from "@dashlane/webextensions-apis";
import {
  STORAGE_KEY_FOR_GLOBAL_STATE,
  STORAGE_KEY_FOR_TAB_STATE_PREFIX,
} from "./constants";
const STORAGE_KEY_FOR_TAB_STATE_REGEX_STRING = `^${STORAGE_KEY_FOR_TAB_STATE_PREFIX}([0-9]*)$`;
export function filterPersistedStorageKeysToCleanup(storageKeys: string[]) {
  const keysToCleanup: string[] = [];
  if (storageKeys.includes(STORAGE_KEY_FOR_GLOBAL_STATE)) {
    keysToCleanup.push(STORAGE_KEY_FOR_GLOBAL_STATE);
  }
  const storageKeysToDeleteRegex = new RegExp(
    STORAGE_KEY_FOR_TAB_STATE_REGEX_STRING
  );
  return storageKeys.reduce((arr, key) => {
    if (storageKeysToDeleteRegex.test(key)) {
      return arr.concat(key);
    }
    return arr;
  }, keysToCleanup);
}
export async function cleanupPersistedStorageKeys() {
  const storageEntries = await storageLocalGet(null);
  const keysToRemove = filterPersistedStorageKeysToCleanup(
    Object.keys(storageEntries)
  );
  if (keysToRemove.length) {
    storageLocalRemove(keysToRemove);
  }
}
