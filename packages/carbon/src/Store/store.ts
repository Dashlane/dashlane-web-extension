import {
  combineReducers,
  createStore as createReduxStore,
  PreloadedState,
  Store as ReduxStore,
} from "redux";
import { Action, AppSessionStorage, State } from "Store/types";
import { inMemoryInterSessionUnsyncedSliceReducer } from "InMemoryInterSessionUnsyncedSettings/Store";
import platform from "Session/Store/platform";
import abtesting from "ABTests/Store/abtesting";
import { applicationReducer as application } from "Application/Store/application";
import { authenticationReducer } from "Authentication/Store";
import { userSessionReducer } from "Session/Store/reducer";
import { blacklistedUserSessionKeys } from "Session/Store/blacklisted-usersession-keys";
import { blacklistedDeviceKeys } from "Device/blacklisted-device-keys";
import { remoteFileReducer as remoteFile } from "Session/Store/file/reducer";
import { globalExtensionSettingsReducer as globalExtensionSettings } from "GlobalExtensionSettings/Store";
import { AntiPhishingReducer as antiPhishing } from "AntiPhishing/reducer";
import { getGlobalPersistenceReducer } from "Store/persistence";
import { eventLoggerReducer as eventLogger } from "Logs/EventLogger/reducer";
import { killswitchReducer } from "Device/Store/killswitch/reducer";
const deviceReducer = combineReducers({
  platform,
  abtesting,
  application,
  remoteFile,
  globalExtensionSettings,
  antiPhishing,
  eventLogger,
  killswitch: killswitchReducer,
});
export const globalReducer = (state: State, action: Action): State => {
  const deviceSlice = state ? state.device : undefined;
  const authenticationSlice = state ? state.authentication : undefined;
  const userSessionSlice = state ? state.userSession : undefined;
  const inMemoryInterSessionUnsyncedSlice = state
    ? state.inMemoryInterSessionUnsynced
    : undefined;
  return {
    device: deviceReducer(deviceSlice, action),
    authentication: authenticationReducer(authenticationSlice, action),
    userSession: userSessionReducer(userSessionSlice, action),
    inMemoryInterSessionUnsynced: inMemoryInterSessionUnsyncedSliceReducer(
      inMemoryInterSessionUnsyncedSlice,
      action
    ),
  };
};
export function createStore(
  sessionStorage?: AppSessionStorage,
  preloadedState?: PreloadedState<State>
): ReduxStore<State> {
  const reducer = getGlobalPersistenceReducer(
    globalReducer,
    {
      device: blacklistedDeviceKeys,
      userSession: blacklistedUserSessionKeys,
    },
    sessionStorage
  );
  return createReduxStore(reducer, preloadedState);
}
