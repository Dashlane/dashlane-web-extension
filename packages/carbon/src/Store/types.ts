import * as Redux from "redux";
import { UserSessionState } from "Session/Store/types";
import { InMemoryInterSessionUnsyncedState } from "InMemoryInterSessionUnsyncedSettings/Store/types";
import { Platform } from "Session/Store/platform";
import { ABTesting } from "ABTests/Store/abtesting";
import { Application } from "Application/Store/application";
import { AuthenticationState } from "Authentication/Store/types";
import { RemoteFileState } from "Session/Store/file/types";
import { GlobalExtensionSettingsState } from "GlobalExtensionSettings/Store/types";
import { EventLoggerState } from "Logs/EventLogger/state";
import { KillswitchState } from "Device/Store/killswitch/types";
export interface DeviceState {
  platform: Platform;
  abtesting: ABTesting;
  application: Application;
  remoteFile: RemoteFileState;
  globalExtensionSettings: GlobalExtensionSettingsState;
  antiPhishing: Set<string>;
  eventLogger: EventLoggerState;
  killswitch: KillswitchState;
}
export interface State {
  device: DeviceState;
  authentication: AuthenticationState;
  userSession: UserSessionState;
  inMemoryInterSessionUnsynced: InMemoryInterSessionUnsyncedState;
}
export interface Action extends Redux.Action {
  type: string;
  [k: string]: any;
}
export interface AppSessionStorage {
  getItem: (key: string) => Promise<unknown>;
  setItem: (key: string, item: unknown) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}
export type BlacklistedSliceKeys<SliceState> = Array<keyof SliceState>;
export type BlacklistedSlices = {
  [Key in keyof State]?: BlacklistedSliceKeys<State[Key]>;
};
