import {
  Store as HermesStore,
  StoreFactory as HermesStoreFactory,
} from "@dashlane/hermes";
import { StoreService } from "Store";
import {
  createEventLoggerVirtualStore,
  updateEventLoggerVirtualStoreState,
} from "./actions";
export class EventLoggerStoreFactory implements HermesStoreFactory {
  public constructor(storeService: StoreService) {
    this.storeService = storeService;
  }
  public createStore<T>(
    storeName: string,
    params: {
      initialState: T;
    }
  ): HermesStore<T> {
    const { storeService } = this;
    storeService.dispatch(
      createEventLoggerVirtualStore({
        storeName,
        initialState: params.initialState,
      })
    );
    return this.makeStore(storeName);
  }
  public getStore<T>(storeName: string): HermesStore<T> {
    if (!this.hasStore(storeName)) {
      throw new Error(`Store ${storeName} was not found`);
    }
    return this.makeStore<T>(storeName);
  }
  public hasStore(storeName: string): boolean {
    const { storeService } = this;
    return storeName in storeService.getState().device.eventLogger;
  }
  private makeStore<T>(storeName: string): HermesStore<T> {
    const { storeService } = this;
    return {
      getState() {
        return storeService.getState().device.eventLogger[storeName] as T;
      },
      updateState(updater) {
        return storeService.dispatch(
          updateEventLoggerVirtualStoreState({
            storeName,
            updater,
          })
        );
      },
    };
  }
  private storeService: StoreService;
}
