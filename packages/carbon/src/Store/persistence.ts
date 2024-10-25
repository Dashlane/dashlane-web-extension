import { Reducer } from "redux";
import { PersistConfig, persistReducer, StateReconciler } from "redux-persist";
import { createBlacklistFilter } from "redux-persist-transform-filter";
import { AppSessionStorage, BlacklistedSlices, State } from "Store/types";
const getStateReconciler = (
  persistenceBlacklists: BlacklistedSlices
): StateReconciler<State> => {
  return (inboundState: State, initialState: State) => {
    return {
      ...inboundState,
      ...Object.keys(persistenceBlacklists).reduce((previousValue, key) => {
        previousValue[key] = inboundState[key];
        persistenceBlacklists[key].forEach((blackListedKey: string) => {
          previousValue[key][blackListedKey] =
            initialState[key][blackListedKey];
        });
        return previousValue;
      }, {}),
    };
  };
};
const getBlacklistFilters = (persistenceBlacklists: BlacklistedSlices) =>
  Object.keys(persistenceBlacklists).map((key) => {
    return createBlacklistFilter(key, persistenceBlacklists[key]);
  });
export const getGlobalPersistenceReducer = (
  globalReducer: Reducer<State>,
  persistenceBlacklists: BlacklistedSlices,
  sessionStorage?: AppSessionStorage
): Reducer<State> => {
  if (sessionStorage) {
    const persistConfig = {
      key: "root",
      stateReconciler: getStateReconciler(persistenceBlacklists),
      storage: sessionStorage,
      version: 1,
      serialize: false,
      deserialize: false,
      transforms: getBlacklistFilters(persistenceBlacklists),
    } as PersistConfig<State>;
    return persistReducer<State>(persistConfig, globalReducer);
  }
  return globalReducer;
};
