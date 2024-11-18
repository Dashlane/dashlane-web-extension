import {
  DeviceLimitCommonContext,
  DeviceLimitDoneStage,
  DeviceLimitStatus,
  LimitedToMultipleDevices,
  LimitedToOneDevice,
  LoginDeviceLimitFlowStage,
  MultipleDevicesLimitReachedStage,
  NoDeviceLimit,
  OneDeviceLimitReachedStage,
  OpeningSessionAfterDeviceLimitRemovalStage,
  RefreshingDeviceLimitStatusStage,
  UnlinkingAndOpeningSessionStage,
  UnlinkMultipleDevicesErrorStage,
  UnlinkMultipleDevicesRequest,
} from "@dashlane/communication";
export const atOneDeviceLimitReachedStage = (
  params: {
    deviceLimitStatus: LimitedToOneDevice;
  } & DeviceLimitCommonContext
): OneDeviceLimitReachedStage => ({
  ...params,
  name: LoginDeviceLimitFlowStage.OneDeviceLimitReached,
});
export const atMultipleDevicesLimitReachedStage = (
  params: {
    deviceLimitStatus: LimitedToMultipleDevices;
  } & DeviceLimitCommonContext
): MultipleDevicesLimitReachedStage => ({
  ...params,
  name: LoginDeviceLimitFlowStage.MultipleDevicesLimitReached,
});
export const atUnlinkingAndOpeningSessionStage = (
  params: {
    deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
  } & DeviceLimitCommonContext
): UnlinkingAndOpeningSessionStage => ({
  ...params,
  name: LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession,
});
export const atOpeningSessionAfterDeviceLimitRemovalStage = (
  params: DeviceLimitCommonContext
): OpeningSessionAfterDeviceLimitRemovalStage => ({
  ...params,
  name: LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval,
});
export const atRefreshingDeviceLimitStatusStage = (
  params: {
    deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
  } & DeviceLimitCommonContext
): RefreshingDeviceLimitStatusStage => ({
  ...params,
  name: LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus,
});
export const atDeviceLimitDoneStage = (
  params: DeviceLimitCommonContext
): DeviceLimitDoneStage => ({
  ...params,
  name: LoginDeviceLimitFlowStage.DeviceLimitDone,
});
export const atUnlinkMultipleDevicesErrorStage = (
  params: {
    retryPayload: UnlinkMultipleDevicesRequest;
    deviceLimitStatus: Exclude<DeviceLimitStatus, NoDeviceLimit>;
  } & DeviceLimitCommonContext
): UnlinkMultipleDevicesErrorStage => ({
  ...params,
  deviceLimitStatus: params.deviceLimitStatus,
  name: LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError,
});
