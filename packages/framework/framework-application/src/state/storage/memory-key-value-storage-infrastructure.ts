import {
  KeyValueStorageInfrastructure,
  ManagedStorageInfrastructure,
} from "./types";
export class MemoryKeyValueStorageInfrastructure
  implements KeyValueStorageInfrastructure
{
  private readonly memory = new Map<string, string>();
  set(key: string, value: string): Promise<void> {
    this.memory.set(key, value);
    return Promise.resolve();
  }
  getAllKeys(): Promise<string[]> {
    return Promise.resolve([...this.memory.keys()]);
  }
  remove(key: string): Promise<void> {
    const value = this.memory.get(key);
    if (!value) {
      return Promise.resolve();
    }
    this.memory.delete(key);
    return Promise.resolve();
  }
  get(key: string): Promise<string | undefined> {
    return Promise.resolve(this.memory.get(key));
  }
}
export class MemoryManagedStorageInfrastructure
  implements ManagedStorageInfrastructure
{
  getAllKeys() {
    return Promise.resolve([]);
  }
  get(key: string) {
    return Promise.resolve(undefined);
  }
}
