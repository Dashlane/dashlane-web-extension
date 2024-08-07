import { AppSessionStorage, CarbonStorage } from "@dashlane/carbon";
import {
  storageLocalGet,
  storageLocalRemove,
  storageLocalSet,
  storageSessionGet,
  storageSessionRemove,
  storageSessionSet,
} from "@dashlane/webextensions-apis";
import { storageLocalItemExists } from "@dashlane/framework-infra/spi";
import { ReadItemValue } from "./storage-layers.types";
function isReadItemValue(value: unknown): value is ReadItemValue {
  return typeof value === "string" || value === null;
}
export function makeStorageLayer(): CarbonStorage {
  return new CarbonStorage({
    itemExists: async (key: string) => {
      return await storageLocalItemExists(key);
    },
    readItem: async (key: string) => {
      const items = await storageLocalGet(key);
      const value = items[key];
      if (!isReadItemValue(value)) {
        return null;
      }
      return value;
    },
    removeItem: async (key: string) => {
      await storageLocalRemove(key);
    },
    writeItem: async (key: string, data: unknown) => {
      const items = { [key]: data };
      await storageLocalSet(items);
    },
  });
}
export function makeSessionStorageLayer(): AppSessionStorage {
  return {
    removeItem: async (key: string) => {
      return await storageSessionRemove(key);
    },
    getItem: async (key: string) => {
      const items = await storageSessionGet(key);
      return items[key];
    },
    setItem: async (key: string, data: unknown) => {
      const items = { [key]: data };
      await storageSessionSet(items).catch((e) => {
        const error = new Error(`carbon storing ${key}: ${e.message}`);
        throw error;
      });
    },
  };
}
