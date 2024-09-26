import { LimitedDeviceInfo } from "./device-info.types";
export interface NotLimitedToMultipleDevices {
  _tag: "notLimitedToMultipleDevices";
}
export interface DeviceToDeactivateInfo extends LimitedDeviceInfo {
  isPairingGroup?: boolean;
  isCurrentDevice?: boolean;
}
export interface UnlinkMultipleDevicesResultSuccess {
  success: true;
}
export interface UnlinkMultipleDevicesResultError {
  success: false;
  error: {
    code: UnlinkMultipleDevicesError;
  };
}
export type UnlinkMultipleDevicesResult =
  | UnlinkMultipleDevicesResultSuccess
  | UnlinkMultipleDevicesResultError;
export interface UnlinkMultipleDevicesRequest {
  pairingGroupIds?: string[];
  deviceIds?: string[];
}
export const USER_STILL_OVERFLOWING = "USER_STILL_OVERFLOWING";
export const UNEXPECTED_ERROR = "UNEXPECTED_ERROR";
export type UnlinkMultipleDevicesError =
  | typeof UNEXPECTED_ERROR
  | typeof USER_STILL_OVERFLOWING;
