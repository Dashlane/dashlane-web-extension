import { slot } from "ts-event-bus";
import {
  AbortDeviceLimitFlowResult,
  UnlinkMultipleDevicesRequest,
  UnlinkMultipleDevicesResult,
  UnlinkPreviousDeviceResult,
} from "../OpenSession";
import { LoginViaSSO, LoginViaSSOResult } from "./types";
export const loginCommandsSlots = {
  abortDeviceLimitFlow: slot<void, AbortDeviceLimitFlowResult>(),
  loginViaSSO: slot<LoginViaSSO, LoginViaSSOResult>(),
  unlinkPreviousDevice: slot<void, UnlinkPreviousDeviceResult>(),
  unlinkMultipleDevices: slot<
    UnlinkMultipleDevicesRequest,
    UnlinkMultipleDevicesResult
  >(),
};
