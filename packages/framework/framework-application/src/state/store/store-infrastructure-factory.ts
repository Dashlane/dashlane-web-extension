import { MemoryAsyncStore } from "./memory-store";
import { DataWithTimestamp, IStore } from "./store.types";
export abstract class StoreInfrastructureFactory {
  public abstract createUserScopedInfrastructure<TState>(
    moduleName: string,
    storeName: string,
    userName: string,
    typeGuard?: (x: unknown) => x is TState
  ): IStore<DataWithTimestamp<TState>>;
  public abstract createDeviceScopedInfrastructure<TState>(
    moduleName: string,
    storeName: string,
    typeGuard?: (x: unknown) => x is TState
  ): IStore<DataWithTimestamp<TState>>;
}
export class MemoryStoreInfrastructureFactory extends StoreInfrastructureFactory {
  createUserScopedInfrastructure<TState>(): IStore<DataWithTimestamp<TState>> {
    return new MemoryAsyncStore<DataWithTimestamp<TState>>({
      timestamp: undefined,
    });
  }
  createDeviceScopedInfrastructure<TState>(): IStore<
    DataWithTimestamp<TState>
  > {
    return new MemoryAsyncStore<DataWithTimestamp<TState>>({
      timestamp: undefined,
    });
  }
}
