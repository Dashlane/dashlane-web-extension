import {
  LimitedToMultipleDevices,
  LimitedToOneDevice,
  UnlinkMultipleDevicesRequest,
} from "@dashlane/communication";
export const DEVICE_LIMIT_REMOVED = "DEVICE_LIMIT_REMOVED";
export const DEVICE_LIMIT_STATUS_UPDATED = "DEVICE_LIMIT_STATUS_UPDATED";
export const ONE_DEVICE_LIMIT_REACHED = "ONE_DEVICE_LIMIT_REACHED";
export const ONE_DEVICE_LIMIT_STILL_REACHED = "ONE_DEVICE_LIMIT_STILL_REACHED";
export const MULTIPLE_DEVICES_LIMIT_REACHED = "MULTIPLE_DEVICES_LIMIT_REACHED";
export const MULTIPLE_DEVICES_LIMIT_STILL_REACHED =
  "MULTIPLE_DEVICES_LIMIT_STILL_REACHED";
export const REFRESH_DEVICE_LIMIT_STATUS_FAILED =
  "REFRESH_DEVICE_LIMIT_STATUS_FAILED";
export const SESSION_OPENED_AFTER_DEVICE_LIMIT_REMOVAL =
  "SESSION_OPENED_AFTER_DEVICE_LIMIT_REMOVAL";
export const UNLINK_PREVIOUS_DEVICE_REQUESTED =
  "UNLINK_PREVIOUS_DEVICE_REQUESTED";
export const UNLINK_MULTIPLE_DEVICES_REQUESTED =
  "UNLINK_MULTIPLE_DEVICES_REQUESTED";
export const UNLINKING_FAILED = "UNLINKING_FAILED";
export const UNLINKING_SUCCEEDED = "UNLINKING_SUCCEEDED";
export const UNLINK_MULTIPLE_DEVICES_ERROR = "UNLINK_MULTIPLE_DEVICES_ERROR";
export interface OneDeviceLimitReachedAction {
  type: typeof ONE_DEVICE_LIMIT_REACHED;
  deviceLimitStatus: LimitedToOneDevice;
  login: string;
  subscriptionCode: string;
}
export interface MultipleDevicesLimitReachedAction {
  type: typeof MULTIPLE_DEVICES_LIMIT_REACHED;
  deviceLimitStatus: LimitedToMultipleDevices;
  login: string;
  subscriptionCode: string;
}
export interface UnlinkPreviousDeviceRequestedAction {
  type: typeof UNLINK_PREVIOUS_DEVICE_REQUESTED;
}
export interface UnlinkMultipleDevicesRequestedAction {
  type: typeof UNLINK_MULTIPLE_DEVICES_REQUESTED;
}
export interface UnlinkingFailedAction {
  type: typeof UNLINKING_FAILED;
}
export interface UnlinkingSucceededAction {
  type: typeof UNLINKING_SUCCEEDED;
}
export interface OneDeviceLimitStillReachedAction {
  type: typeof ONE_DEVICE_LIMIT_STILL_REACHED;
  updatedDeviceLimitStatus: LimitedToOneDevice;
}
export interface MultipleDevicesLimitStillReachedAction {
  type: typeof MULTIPLE_DEVICES_LIMIT_STILL_REACHED;
  updatedDeviceLimitStatus: LimitedToMultipleDevices;
}
export interface DeviceLimitStatusUpdatedAction {
  type: typeof DEVICE_LIMIT_STATUS_UPDATED;
}
export interface DeviceLimitRemovedAction {
  type: typeof DEVICE_LIMIT_REMOVED;
}
export interface RefreshDeviceLimitStatusFailedAction {
  type: typeof REFRESH_DEVICE_LIMIT_STATUS_FAILED;
}
export interface SessionOpenedAfterDeviceLimitRemovalAction {
  type: typeof SESSION_OPENED_AFTER_DEVICE_LIMIT_REMOVAL;
}
export interface UnlinkMultipleDevicesError {
  type: typeof UNLINK_MULTIPLE_DEVICES_ERROR;
  retryPayload: UnlinkMultipleDevicesRequest;
}
export type LoginDeviceLimitFlowAction =
  | OneDeviceLimitReachedAction
  | MultipleDevicesLimitReachedAction
  | UnlinkPreviousDeviceRequestedAction
  | UnlinkMultipleDevicesRequestedAction
  | UnlinkingSucceededAction
  | UnlinkingFailedAction
  | DeviceLimitStatusUpdatedAction
  | RefreshDeviceLimitStatusFailedAction
  | SessionOpenedAfterDeviceLimitRemovalAction
  | DeviceLimitRemovedAction
  | OneDeviceLimitStillReachedAction
  | MultipleDevicesLimitStillReachedAction
  | UnlinkMultipleDevicesError;
export const oneDeviceLimitReached = (params: {
  login: string;
  subscriptionCode: string;
  deviceLimitStatus: LimitedToOneDevice;
}): OneDeviceLimitReachedAction => ({
  type: ONE_DEVICE_LIMIT_REACHED,
  deviceLimitStatus: params.deviceLimitStatus,
  login: params.login,
  subscriptionCode: params.subscriptionCode,
});
export const multipleDevicesLimitReached = (params: {
  login: string;
  subscriptionCode: string;
  deviceLimitStatus: LimitedToMultipleDevices;
}): MultipleDevicesLimitReachedAction => ({
  type: MULTIPLE_DEVICES_LIMIT_REACHED,
  deviceLimitStatus: params.deviceLimitStatus,
  login: params.login,
  subscriptionCode: params.subscriptionCode,
});
export const unlinkPreviousDeviceRequested =
  (): UnlinkPreviousDeviceRequestedAction => ({
    type: UNLINK_PREVIOUS_DEVICE_REQUESTED,
  });
export const unlinkingMultipleDevicesRequested =
  (): UnlinkMultipleDevicesRequestedAction => ({
    type: UNLINK_MULTIPLE_DEVICES_REQUESTED,
  });
export const unlinkingFailed = (): UnlinkingFailedAction => ({
  type: UNLINKING_FAILED,
});
export const unlinkingSucceeded = (): UnlinkingSucceededAction => ({
  type: UNLINKING_SUCCEEDED,
});
export const deviceLimitStatusUpdated = (): DeviceLimitStatusUpdatedAction => ({
  type: DEVICE_LIMIT_STATUS_UPDATED,
});
export const deviceLimitRemoved = (): DeviceLimitRemovedAction => ({
  type: DEVICE_LIMIT_REMOVED,
});
export const refreshDeviceLimitStatusFailed =
  (): RefreshDeviceLimitStatusFailedAction => ({
    type: REFRESH_DEVICE_LIMIT_STATUS_FAILED,
  });
export const sessionOpenedAfterDeviceLimitRemoval =
  (): SessionOpenedAfterDeviceLimitRemovalAction => ({
    type: SESSION_OPENED_AFTER_DEVICE_LIMIT_REMOVAL,
  });
export const oneDeviceLimitStillReached = (params: {
  updatedDeviceLimitStatus: LimitedToOneDevice;
}): OneDeviceLimitStillReachedAction => ({
  type: ONE_DEVICE_LIMIT_STILL_REACHED,
  updatedDeviceLimitStatus: params.updatedDeviceLimitStatus,
});
export const multipleDevicesLimitStillReached = (params: {
  updatedDeviceLimitStatus: LimitedToMultipleDevices;
}): MultipleDevicesLimitStillReachedAction => ({
  type: MULTIPLE_DEVICES_LIMIT_STILL_REACHED,
  updatedDeviceLimitStatus: params.updatedDeviceLimitStatus,
});
export const unlinkMultipleDevicesErrorReached = (params: {
  retryPayload: UnlinkMultipleDevicesRequest;
}): UnlinkMultipleDevicesError => ({
  type: UNLINK_MULTIPLE_DEVICES_ERROR,
  retryPayload: params.retryPayload,
});
