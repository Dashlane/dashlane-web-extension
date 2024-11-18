import {
  storageSessionGet,
  storageSessionIsSupported,
  storageSessionRemove,
  storageSessionSet,
} from "@dashlane/webextensions-apis";
import {
  AutofillEngineState,
  AutofillEngineStateStorage,
} from "@dashlane/autofill-engine/server";
import { AutofillEngineState as AutofillEngineStateType } from "./init-autofill-engine.types";
class InMemoryStateStorage implements AutofillEngineStateStorage {
  public getState(key: string): Promise<AutofillEngineState> {
    const stateSlice = this.state.get(key);
    if (!stateSlice) {
      return Promise.resolve({});
    }
    return Promise.resolve(stateSlice);
  }
  public setState(key: string, newState: AutofillEngineState): Promise<void> {
    if (Object.keys(newState).length === 0) {
      this.state.delete(key);
    } else {
      this.state.set(key, newState);
    }
    return Promise.resolve();
  }
  private readonly state = new Map<string, AutofillEngineState>();
}
class SessionStateStorage implements AutofillEngineStateStorage {
  public async getState(key: string): Promise<AutofillEngineState> {
    const state = await storageSessionGet(key);
    if (state[key]) {
      return state[key] as AutofillEngineStateType;
    }
    return {};
  }
  public async setState(
    key: string,
    newState: AutofillEngineState
  ): Promise<void> {
    if (Object.keys(newState).length === 0) {
      await storageSessionRemove(key);
    } else {
      await storageSessionSet({ [key]: newState });
    }
  }
}
export function initStateStorage() {
  if (!storageSessionIsSupported()) {
    return new InMemoryStateStorage();
  }
  return new SessionStateStorage();
}
