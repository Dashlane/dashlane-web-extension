import { Debugger } from "Logs/Debugger";
import { AsyncStorage, StorageService } from "./types";
interface BackupedItemResolution {
  clean: () => Promise<void>;
  restoreAndClean: () => Promise<void>;
}
export class CarbonLocalStorage implements AsyncStorage {
  constructor(private readonly _storage: AsyncStorage) {}
  public itemExists(key: string): Promise<boolean> {
    return this._storage.itemExists(key);
  }
  public readItem(key: string): Promise<string | null> {
    return this._storage.readItem(key);
  }
  public async writeItem(key: string, value: any): Promise<void> {
    const backup = await this.backupItem(key);
    try {
      await this._storage.writeItem(key, value);
      if (backup) {
        await backup.clean();
      }
    } catch (error) {
      Debugger.error("CarbonLocalStorage:writeItem error:", error);
      if (backup) {
        Debugger.error(
          `CarbonLocalStorage couldn't save data, reverting to backup version`
        );
        await backup.restoreAndClean();
      } else {
        Debugger.error(
          `CarbonLocalStorage couldn't save data and no backup version to restore`
        );
      }
    }
  }
  public removeItem(key: string): Promise<void> {
    return this._storage.removeItem(key);
  }
  private async getSuitableBackupKey(key: string): Promise<string> {
    const getNthKeyVariant = (keyIndex: number) => key + "." + keyIndex;
    let keyIndex = 1;
    while (await this._storage.itemExists(getNthKeyVariant(keyIndex))) {
      keyIndex++;
    }
    return getNthKeyVariant(keyIndex);
  }
  private async backupItem(
    key: string
  ): Promise<BackupedItemResolution | null> {
    const itemExists = await this._storage.itemExists(key);
    if (!itemExists) {
      return null;
    }
    const backupKey = await this.getSuitableBackupKey(key);
    const value = await this._storage.readItem(key);
    await this._storage.writeItem(backupKey, value);
    const storage = this._storage;
    async function clean(): Promise<void> {
      return await storage.removeItem(backupKey);
    }
    async function restoreAndClean(): Promise<void> {
      const previousValue = await storage.readItem(backupKey);
      await storage.writeItem(key, previousValue);
      return await clean();
    }
    return {
      clean,
      restoreAndClean,
    };
  }
}
export const makeStorageService = (): StorageService => {
  let storage: AsyncStorage = null;
  return {
    setInstance: (instance: AsyncStorage) => {
      storage = instance;
    },
    getLocalStorage: (): AsyncStorage => {
      if (!storage) {
        throw new Error(
          "makeStorageService: You must call setInstance(instance: AsyncStorage) before getting the instance"
        );
      }
      return storage;
    },
  };
};
