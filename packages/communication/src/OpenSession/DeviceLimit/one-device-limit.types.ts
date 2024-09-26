import { Platform } from "./device-info.types";
import { LimitedToOneDevice } from "./device-limit.types";
export interface MonoBucketOwner {
  deviceName: null | string;
  devicePlatform: null | Platform;
  lastActivityDate: number;
}
export interface NotLimitedToOneDevice {
  _tag: "notLimitedToOneDevice";
}
export type OneDeviceLimitStatus = LimitedToOneDevice | NotLimitedToOneDevice;
export enum UnlinkPreviousDeviceError {
  UnexpectedError = "UNEXPECTED_ERROR",
}
export interface UnlinkPreviousDeviceSuccess {
  success: true;
}
export interface UnlinkPreviousDeviceFailure {
  success: false;
  error: {
    code: UnlinkPreviousDeviceError;
  };
}
export type UnlinkPreviousDeviceResult =
  | UnlinkPreviousDeviceSuccess
  | UnlinkPreviousDeviceFailure;
