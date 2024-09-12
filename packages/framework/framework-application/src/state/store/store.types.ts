import { UseCaseScope } from "@dashlane/framework-contracts";
import { Class } from "@dashlane/framework-types";
import { Codec } from "@dashlane/framework-services";
import { StoreStorageClassDefinition } from "../storage/storage.types";
import { StoreInfrastructureFactory } from "./store-infrastructure-factory";
import { IStorage } from "../storage/types";
import { Observable } from "rxjs";
import { AllowedToFail } from "../../errors-handling/allowed-to-fail";
import { StoreCapacity } from "./define-store.types";
export type DataWithTimestamp<T> =
  | {
      timestamp: undefined;
      data?: undefined;
    }
  | {
      data: T;
      timestamp: number;
    };
export interface IStore<T = any> {
  readonly state$: Observable<T>;
  readonly getState: () => Promise<T>;
  set: (value: T) => Promise<void>;
  init: (value: T) => Promise<void>;
  clear: () => Promise<void>;
  clearStorage: () => Promise<void>;
  stop: () => void;
  update: (updater: (value: T) => T) => Promise<void>;
  persist: () => Promise<void>;
  load: () => Promise<void>;
  getLimit: () => Promise<number | undefined>;
}
type BaseStoreDefinition<TStore = any> = {
  storeName: string;
  scope: UseCaseScope;
  isCache?: boolean;
  capacity?: StoreCapacity;
  storeTypeGuard?: (x: unknown) => x is TStore;
};
export type PersistedStoreDefinition<
  TStore = any,
  TStorage = any
> = BaseStoreDefinition<TStore> & {
  persist: true;
  codec: Class<Codec<TStorage, TStore>>;
  storage: StoreStorageClassDefinition<TStorage>;
};
export type NonPersistedStoreDefinition<TStore = any> =
  BaseStoreDefinition<TStore> & {
    persist: false;
    codec?: undefined;
    initialValue: TStore;
  };
export type StoreDefinition<TStore = any, TStorage = any> =
  | NonPersistedStoreDefinition<TStore>
  | PersistedStoreDefinition<TStore, TStorage>;
export type StoreClassDefinition<TStore = any, TStorage = any> = Class<
  IStore<TStore>,
  [
    moduleName: string,
    conf: StoreDefinition<TStore, TStorage>,
    factory: StoreInfrastructureFactory,
    userName: string,
    allowedToFail: AllowedToFail,
    storage?: IStorage<TStorage>,
    codec?: Codec<TStorage, TStore>
  ]
> & {
  Definition: StoreDefinition<TStore, TStorage>;
};
