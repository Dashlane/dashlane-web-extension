import {
  DeviceLimitStatus,
  LimitedToMultipleDevices,
  LimitedToOneDevice,
  NoDeviceLimit,
} from "./device-limit.types";
import { UnlinkMultipleDevicesRequest } from "./multiple-devices-limit.types";
export enum LoginDeviceLimitFlowStage {
  OneDeviceLimitReached = "OneDeviceLimitReached",
  MultipleDevicesLimitReached = "MultipleDevicesLimitReached",
  UnlinkingAndOpeningSession = "UnlinkingAndOpeningSession",
  UnlinkingMultipleDevicesError = "UnlinkingMultipleDevicesError",
  RefreshingDeviceLimitStatus = "RefreshingDeviceLimitStatus",
  OpeningSessionAfterDeviceLimitRemoval = "OpeningSessionAfterDeviceLimitRemoval",
  DeviceLimitDone = "DeviceLimitDone",
}
export interface DeviceLimitCommonContext {
  readonly login: string;
  readonly subscriptionCode: string;
}
export interface OneDeviceLimitReachedStage extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.OneDeviceLimitReached;
  readonly deviceLimitStatus: LimitedToOneDevice;
}
export interface MultipleDevicesLimitReachedStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.MultipleDevicesLimitReached;
  readonly deviceLimitStatus: LimitedToMultipleDevices;
}
export interface RefreshingDeviceLimitStatusStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus;
  readonly deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
}
export interface OpeningSessionAfterDeviceLimitRemovalStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval;
}
export interface UnlinkingAndOpeningSessionStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession;
  readonly deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
}
export interface UnlinkMultipleDevicesErrorStage
  extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError;
  readonly retryPayload: UnlinkMultipleDevicesRequest;
  readonly deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
}
export interface DeviceLimitDoneStage extends DeviceLimitCommonContext {
  readonly name: LoginDeviceLimitFlowStage.DeviceLimitDone;
}
export type LoginDeviceLimitFlow =
  | OneDeviceLimitReachedStage
  | MultipleDevicesLimitReachedStage
  | RefreshingDeviceLimitStatusStage
  | OpeningSessionAfterDeviceLimitRemovalStage
  | UnlinkingAndOpeningSessionStage
  | UnlinkMultipleDevicesErrorStage
  | DeviceLimitDoneStage;
