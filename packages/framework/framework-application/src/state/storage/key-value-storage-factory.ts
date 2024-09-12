import { IStorage, KeyValueStorageInfrastructure } from "./types";
export class KeyValueStorage implements IStorage<string> {
  constructor(
    private storage: KeyValueStorageInfrastructure,
    private baseKey: string,
    private initialValueFactory?: () => Promise<string>
  ) {}
  public clear(): Promise<void> {
    return this.storage.remove(this.baseKey);
  }
  public async read(): Promise<string | undefined> {
    const value = await this.storage.get(this.baseKey);
    if (!value && this.initialValueFactory) {
      return await this.initialValueFactory();
    }
    return value;
  }
  public async write(data: string): Promise<void> {
    await this.storage.set(this.baseKey, data);
  }
}
export class KeyValueStorageFactory {
  constructor(private storage: KeyValueStorageInfrastructure) {}
  createBackend(
    moduleName: string,
    storageName: string,
    userName: string,
    initialValueFactory?: () => Promise<string>
  ): IStorage {
    const baseKey = userName
      ? `${moduleName}.${storageName}.${userName}`
      : `${moduleName}.${storageName}`;
    return new KeyValueStorage(this.storage, baseKey, initialValueFactory);
  }
}
