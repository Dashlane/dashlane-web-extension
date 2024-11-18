import { StoreInfrastructureFactory } from "./store-infrastructure-factory";
import { StoreClassDefinition, StoreDefinition } from "./store.types";
import { Injectable } from "../../dependency-injection/injectable.decorator";
import { defineStorageClass } from "../storage/define-storage";
import {
  DeprecatedStoreConfiguration,
  isStoreConfiguration,
  StoreConfiguration,
} from "./define-store.types";
import { Codec } from "@dashlane/framework-services";
import { IStorage } from "../storage/types";
import { Store } from "./store";
import { AllowedToFail } from "../../errors-handling/allowed-to-fail";
const configurationToDefinition = <TStore, TStorage = unknown>(
  conf:
    | StoreConfiguration<TStore, TStorage>
    | DeprecatedStoreConfiguration<TStore, TStorage>
): StoreDefinition<TStore, TStorage> => {
  if (!conf.persist) {
    return {
      persist: false,
      initialValue: conf.initialValue,
      scope: conf.scope,
      storeName: conf.storeName,
      capacity: isStoreConfiguration(conf) ? conf.capacity : undefined,
    };
  }
  return {
    persist: true,
    codec: conf.codec,
    scope: conf.scope,
    storeName: conf.storeName,
    storeTypeGuard: conf.storeTypeGuard,
    isCache: conf.isCache,
    storage: defineStorageClass({
      ...conf.storage,
      storageName: conf.storeName,
      isCache: conf.isCache ?? false,
    }),
    capacity: isStoreConfiguration(conf) ? conf.capacity : undefined,
  };
};
export function defineStore<TMemoryState, TPersistedState = unknown>(
  configuration: DeprecatedStoreConfiguration<TMemoryState, TPersistedState>
): StoreClassDefinition<TMemoryState, TPersistedState>;
export function defineStore<TMemoryState, TPersistedState = unknown>(
  configuration: StoreConfiguration<TMemoryState, TPersistedState>
): StoreClassDefinition<TMemoryState, TPersistedState>;
export function defineStore<TMemoryState, TPersistedState = unknown>(
  configuration: DeprecatedStoreConfiguration<TMemoryState, TPersistedState>
): StoreClassDefinition<TMemoryState, TPersistedState> {
  const definition = configurationToDefinition(configuration);
  const result = class extends Store<TMemoryState, TPersistedState> {
    public static readonly Definition = definition;
    constructor(
      moduleName: string,
      conf: StoreDefinition<TMemoryState, TPersistedState>,
      factory: StoreInfrastructureFactory,
      userName: string,
      allowedToFail: AllowedToFail,
      storage?: IStorage<TPersistedState>,
      codec?: Codec<TPersistedState, TMemoryState>
    ) {
      super(moduleName, conf, factory, userName, allowedToFail, storage, codec);
    }
  };
  Injectable()(result);
  return result;
}
