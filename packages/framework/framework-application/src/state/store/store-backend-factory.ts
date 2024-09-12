import { IStore } from "./store.types";
export abstract class StoreBackendFactory {
  public abstract createBackend<TState>(
    moduleName: string,
    storeName: string,
    userName?: string
  ): IStore<TState>;
}
