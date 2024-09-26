import { CarbonLocalStorage } from "Libs/Storage/index";
import { AsyncStorage } from "Libs/Storage/types";
import { ApplicationSettingsData } from "Application/ApplicationSettings";
export const memoryStorage = {} as ApplicationSettingsData;
export class LocalMemoryStorage extends CarbonLocalStorage {
  constructor(asyncStorage: AsyncStorage) {
    super(asyncStorage);
  }
  async keys(): Promise<string[]> {
    return Object.keys(memoryStorage);
  }
  async readItems(keys: string[]): Promise<{
    [key: string]: string;
  }> {
    const promises = keys.map((key) => this.readItem(key));
    const values = await Promise.all(promises);
    return keys.reduce((storageContent, key, idx) => {
      return { ...storageContent, [key]: values[idx] };
    }, {});
  }
  async writeItems(items: { [key: string]: string }): Promise<void> {
    Object.keys(items).forEach((key) => (memoryStorage[key] = items[key]));
    return Promise.resolve(null);
  }
}
export default function getLocalMemoryStorage(): LocalMemoryStorage {
  return new LocalMemoryStorage({
    readItem: (key: string) => {
      return Promise.resolve(memoryStorage[key] ? memoryStorage[key] : null);
    },
    writeItem: (key: string, value: any) => {
      memoryStorage[key] = value;
      return Promise.resolve(null);
    },
    removeItem: (key: string) =>
      new Promise<void>((resolve) => {
        delete memoryStorage[key];
        resolve(null);
      }),
    itemExists: (key: string) =>
      Promise.resolve(memoryStorage[key] !== undefined),
  });
}
export function clearStorageDEBUGONLY() {
  Object.keys(memoryStorage).forEach(function (key) {
    delete memoryStorage[key];
  });
}
export function logStorageDEBUGONLY() {
  console.log(memoryStorage);
}
