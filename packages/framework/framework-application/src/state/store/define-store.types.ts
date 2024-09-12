import { UseCaseScope } from "@dashlane/framework-contracts";
import { Codec } from "@dashlane/framework-services";
import { Class } from "@dashlane/framework-types";
import { StoreStorageConfiguration } from "../storage/define-storage.types";
export enum StoreCapacity {
  _001KB = "1KB",
  _010KB = "10KB",
  _100KB = "100KB",
  _001MB = "1MB",
  Unlimited = "Unlimited",
}
export interface StoreCommonConf<TStore = any> {
  storeName: string;
  scope: UseCaseScope;
  capacity: StoreCapacity;
  isCache?: boolean;
  storeTypeGuard?: (x: unknown) => x is TStore;
}
export interface NonPersistedStoreConf<TStore = any>
  extends StoreCommonConf<TStore> {
  persist: false;
  initialValue: TStore;
}
export interface PersistedStoreConf<TStore = any, TStorage = any>
  extends StoreCommonConf<TStore> {
  persist: true;
  codec: Class<Codec<TStorage, TStore>>;
  storage: StoreStorageConfiguration<TStorage>;
}
export type StoreConfiguration<TStore = any, TStorage = any> =
  | NonPersistedStoreConf<TStore>
  | PersistedStoreConf<TStore, TStorage>;
export type DeprecatedStoreConfiguration<TStore = any, TStorage = any> =
  | Omit<NonPersistedStoreConf<TStore>, "capacity">
  | Omit<PersistedStoreConf<TStore, TStorage>, "capacity">;
export function isStoreConfiguration<TStore, TStorage>(
  conf: unknown
): conf is StoreConfiguration<TStore, TStorage> {
  return typeof conf === "object" && conf !== null && "capacity" in conf;
}
