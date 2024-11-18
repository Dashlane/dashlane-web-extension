export interface AsyncStorage {
  isSupported?: () => Promise<boolean>;
  itemExists: (key: string) => Promise<boolean>;
  readItem: (key: string) => Promise<string | null>;
  writeItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}
export interface StorageService {
  setInstance: (instance: AsyncStorage) => void;
  getLocalStorage: () => AsyncStorage;
}
