import {
  AbortDeviceLimitFlowResult,
  UnlinkMultipleDevicesRequest,
  UnlinkMultipleDevicesResult,
  UnlinkPreviousDeviceResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type DeviceLimitCommands = {
  abortDeviceLimitFlow: Command<void, AbortDeviceLimitFlowResult>;
  unlinkPreviousDevice: Command<void, UnlinkPreviousDeviceResult>;
  unlinkMultipleDevices: Command<
    UnlinkMultipleDevicesRequest,
    UnlinkMultipleDevicesResult
  >;
};
