import { Platform } from "Session/Store/platform";
import { ABTesting } from "ABTests/Store/abtesting";
import { Application } from "Application/Store/application";
import { RemoteFileState } from "Session/Store/file/types";
import { GlobalExtensionSettingsState } from "GlobalExtensionSettings/Store/types";
import { AntiPhishingState } from "AntiPhishing/types";
import { EventLoggerState } from "Logs/EventLogger/state";
import { KillswitchState } from "Device/Store/killswitch/types";
export interface DeviceState {
  platform: Platform;
  abtesting: ABTesting;
  application: Application;
  remoteFile: RemoteFileState;
  globalExtensionSettings: GlobalExtensionSettingsState;
  antiPhishing: AntiPhishingState;
  eventLogger: EventLoggerState;
  killswitch: KillswitchState;
}
