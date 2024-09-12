export type VersionedData<TStorage> = {
  version: number;
  content: TStorage;
};
export function isVersionedData(data: unknown): data is VersionedData<unknown> {
  return (
    data !== null &&
    typeof data === "object" &&
    "version" in data &&
    typeof data.version === "number" &&
    "content" in data
  );
}
export interface IStorage<T = any> {
  clear: () => Promise<void>;
  read: () => Promise<T | undefined>;
  write: (data: T) => Promise<void>;
}
export const NullStorage: IStorage = {
  read: () => Promise.resolve(undefined),
  write: () => Promise.resolve(),
  clear: () => Promise.resolve(),
};
export abstract class KeyValueStorageInfrastructure {
  abstract set(key: string, value: string): Promise<void>;
  abstract remove(key: string): Promise<void>;
  abstract get(key: string): Promise<string | undefined>;
  abstract getAllKeys: () => Promise<string[]>;
}
export abstract class ManagedStorageInfrastructure {
  abstract get(key: string): Promise<string | undefined>;
  abstract getAllKeys: () => Promise<string[]>;
}
