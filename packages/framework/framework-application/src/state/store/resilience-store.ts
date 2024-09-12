import { Observable } from "rxjs";
import { DataWithTimestamp, IStore, StoreDefinition } from "./store.types";
import { UseCaseScope } from "@dashlane/framework-contracts";
import { StoreInfrastructureFactory } from "./store-infrastructure-factory";
import { StoreCapacity } from ".";
export class ResilienceStore<TMemoryState>
  implements IStore<DataWithTimestamp<TMemoryState>>
{
  private readonly quickMemoryInfrastructure: IStore<
    DataWithTimestamp<TMemoryState>
  >;
  private readonly key: string;
  public readonly state$: Observable<DataWithTimestamp<TMemoryState>>;
  constructor(
    moduleName: string,
    private conf: StoreDefinition<TMemoryState>,
    factory: StoreInfrastructureFactory,
    userName: string
  ) {
    switch (conf.scope) {
      case UseCaseScope.Device: {
        this.quickMemoryInfrastructure =
          factory.createDeviceScopedInfrastructure<TMemoryState>(
            moduleName,
            conf.storeName,
            conf.storeTypeGuard
          );
        this.key = `graphene.${moduleName}.${conf.storeName}`;
        break;
      }
      case UseCaseScope.User: {
        if (!userName) {
          throw new Error(
            "Attempting to create a user-scoped store without a user"
          );
        }
        this.quickMemoryInfrastructure =
          factory.createUserScopedInfrastructure<TMemoryState>(
            moduleName,
            conf.storeName,
            userName,
            conf.storeTypeGuard
          );
        this.key = `graphene.${moduleName}.${conf.storeName}.${userName}`;
      }
    }
    this.state$ = this.quickMemoryInfrastructure.state$;
  }
  public set = async (value: DataWithTimestamp<TMemoryState>) => {
    const limit = await this.quickMemoryInfrastructure.getLimit();
    if (limit) {
      if (this.conf.capacity === StoreCapacity.Unlimited && this.conf.persist) {
        return;
      }
    }
    return this.quickMemoryInfrastructure.set(value);
  };
  public getState = () => {
    return this.quickMemoryInfrastructure.getState();
  };
  public init = (value: DataWithTimestamp<TMemoryState>) => {
    return this.quickMemoryInfrastructure.init(value);
  };
  public update = async (
    updater: (
      value: DataWithTimestamp<TMemoryState>
    ) => DataWithTimestamp<TMemoryState>
  ) => {
    return this.set(updater(await this.getState()));
  };
  public clearStorage = () => {
    return this.quickMemoryInfrastructure.clearStorage();
  };
  public clear = () => {
    return this.quickMemoryInfrastructure.clear();
  };
  public persist = () => {
    return this.quickMemoryInfrastructure.persist();
  };
  public load = () => {
    return this.quickMemoryInfrastructure.load();
  };
  public stop = () => {
    return this.quickMemoryInfrastructure.stop();
  };
  public getLimit = () => {
    return Promise.reject(new Error("not implemented"));
  };
}
