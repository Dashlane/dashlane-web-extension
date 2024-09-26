import { DeviceToDeactivateInfo } from "./multiple-devices-limit.types";
import { MonoBucketOwner } from "./one-device-limit.types";
export interface LimitedToOneDevice {
  _tag: "limitedToOneDevice";
  bucketOwner: MonoBucketOwner;
}
export interface LimitedToMultipleDevices {
  _tag: "limitedToMultipleDevices";
  devices: DeviceToDeactivateInfo[];
}
export interface NoDeviceLimit {
  _tag: "noDeviceLimit";
}
export type DeviceLimitStatus =
  | LimitedToOneDevice
  | NoDeviceLimit
  | LimitedToMultipleDevices;
export enum AbortDeviceLimitFlowError {
  UnexpectedError = "UNEXPECTED_ERROR",
}
export interface AbortDeviceLimitFlowSuccess {
  success: true;
}
export interface AbortDeviceLimitFlowFailure {
  success: false;
  error: {
    code: AbortDeviceLimitFlowError;
  };
}
export type AbortDeviceLimitFlowResult =
  | AbortDeviceLimitFlowSuccess
  | AbortDeviceLimitFlowFailure;
