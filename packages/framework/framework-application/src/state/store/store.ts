import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  firstValueFrom,
  map,
  Observable,
} from "rxjs";
import { Codec } from "@dashlane/framework-services";
import { DataWithTimestamp, IStore, StoreDefinition } from "./store.types";
import { IStorage } from "../storage/types";
import { StoreInfrastructureFactory } from "./store-infrastructure-factory";
import { ResilienceStore } from "./resilience-store";
import { AllowedToFail } from "../../errors-handling/allowed-to-fail";
export class Store<TMemoryState = any, TPersistedState = any>
  implements IStore<TMemoryState>
{
  public readonly state$: Observable<TMemoryState>;
  private readonly timeGetter: () => number;
  private readonly infrastructure: IStore<DataWithTimestamp<TMemoryState>>;
  private readonly localState$: BehaviorSubject<
    DataWithTimestamp<TMemoryState>
  >;
  private readonly mergedState$: Observable<DataWithTimestamp<TMemoryState>>;
  constructor(
    moduleName: string,
    private conf: StoreDefinition<TMemoryState>,
    factory: StoreInfrastructureFactory,
    userName: string,
    private allowedToFail: AllowedToFail,
    private storage?: IStorage<TPersistedState>,
    private codec?: Codec<TPersistedState, TMemoryState>
  ) {
    this.infrastructure = new ResilienceStore<TMemoryState>(
      moduleName,
      conf,
      factory,
      userName
    );
    this.timeGetter = () => Date.now();
    this.localState$ = new BehaviorSubject<DataWithTimestamp<TMemoryState>>({
      timestamp: undefined,
    });
    this.mergedState$ = combineLatest({
      infra: this.infrastructure.state$,
      current: this.localState$,
    }).pipe(
      map(({ current, infra }) => {
        if (!infra.timestamp) {
          return current;
        }
        if (!current.timestamp || infra.timestamp > current.timestamp) {
          return infra;
        }
        return current;
      }),
      distinctUntilChanged()
    );
    const defaultValue = conf.persist ? undefined : conf.initialValue;
    this.state$ = this.mergedState$.pipe(
      filter((x) => !conf.persist || !!x.timestamp),
      map((x) => x.data ?? (defaultValue as TMemoryState))
    );
  }
  public getState(): Promise<TMemoryState> {
    return firstValueFrom(this.state$);
  }
  public async set(value: TMemoryState): Promise<void> {
    try {
      await this.setWithoutPersist(value);
    } finally {
      await this.persist();
    }
  }
  private async setWithoutPersist(value: TMemoryState): Promise<void> {
    const withTimestamp: DataWithTimestamp<TMemoryState> = {
      data: value,
      timestamp: this.timeGetter(),
    };
    this.localState$.next(withTimestamp);
    let error;
    const success = await this.allowedToFail.doOne(() => {
      return this.infrastructure.set(withTimestamp).catch((e) => {
        error = new Error(`${this.conf.storeName}: ${e.message}`);
        throw error;
      });
    });
    if (!success) {
      if (this.conf.persist) {
        return this.infrastructure.clear();
      } else {
        return Promise.reject(error);
      }
    }
  }
  public init(value: TMemoryState): Promise<void> {
    const withTimestamp: DataWithTimestamp<TMemoryState> = {
      data: value,
      timestamp: 0,
    };
    this.localState$.next(withTimestamp);
    return Promise.resolve();
  }
  public async clear(): Promise<void> {
    this.localState$.next({ timestamp: undefined });
    await this.infrastructure.clear();
  }
  public async clearStorage(): Promise<void> {
    if (!this.storage) {
      throw new Error("Persisted stores should have storage");
    }
    await this.storage.clear();
  }
  public stop(): void {
    this.localState$.complete();
  }
  public async update(updater: (value: TMemoryState) => TMemoryState) {
    const value = await this.getState();
    await this.set(updater(value));
  }
  public async load(): Promise<void> {
    const infraState = await this.infrastructure.getState();
    if (infraState.timestamp) {
      this.localState$.next(infraState);
      return;
    }
    const { conf, codec, storage } = this;
    if (!conf.persist) {
      return;
    }
    if (!codec || !storage) {
      throw new Error("Persisted stores should have conf/storage");
    }
    const success = await this.allowedToFail.conditionallyAllowToFailOne(
      async () => {
        const inStorage: TPersistedState =
          (await storage.read()) ?? conf.storage.Definition.initialValue;
        const value = await codec.decode(inStorage);
        await this.setWithoutPersist(value);
      },
      !!conf.isCache
    );
    if (!success) {
      await this.setWithoutPersist(
        await codec.decode(conf.storage.Definition.initialValue)
      );
    }
  }
  public async persist(): Promise<void> {
    const { conf, codec, storage } = this;
    if (!conf.persist) {
      return;
    }
    if (!codec || !storage) {
      throw new Error("Persisted stores should have conf/storage");
    }
    const value = await this.getState();
    const content = await codec.encode(value);
    await storage.write(content);
  }
  public getLimit = () => {
    return Promise.reject(new Error("not implemented"));
  };
}
