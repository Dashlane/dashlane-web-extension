import { LoginDeviceLimitFlowStage } from "./device-limit-flow.types";
import { UnlinkMultipleDevicesRequest } from "./multiple-devices-limit.types";
import { DeviceToDeactivateInfoView } from "./multiple-devices-limit.view";
import { PreviousDeviceInfo } from "./one-device-limit.views";
export interface OneDeviceLimitReachedStageView {
  readonly name: LoginDeviceLimitFlowStage.OneDeviceLimitReached;
  readonly login: string;
  readonly previousDevice: PreviousDeviceInfo;
  readonly subscriptionCode: string;
}
export interface MultipleDevicesLimitReachedStageView {
  readonly name: LoginDeviceLimitFlowStage.MultipleDevicesLimitReached;
  readonly login: string;
  readonly devicesToDeactivate: DeviceToDeactivateInfoView[];
  readonly subscriptionCode: string;
}
export interface UnlinkMultipleDevicesErrorStageView {
  readonly name: LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError;
  readonly login: string;
  readonly retryPayload: UnlinkMultipleDevicesRequest;
  readonly subscriptionCode: string;
}
export interface UnlinkingAndOpeningSessionStageView {
  readonly name: LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession;
  readonly login: string;
}
export interface DeviceLimitDoneStageView {
  readonly name: LoginDeviceLimitFlowStage.DeviceLimitDone;
  readonly login: string;
}
export interface RefreshingDeviceLimitStatusStageView {
  readonly name: LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus;
  readonly login: string;
}
export interface OpeningSessionAfterDeviceLimitRemovalStageView {
  readonly name: LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval;
  readonly login: string;
}
export type LoginDeviceLimitFlowView =
  | OneDeviceLimitReachedStageView
  | MultipleDevicesLimitReachedStageView
  | UnlinkingAndOpeningSessionStageView
  | RefreshingDeviceLimitStatusStageView
  | OpeningSessionAfterDeviceLimitRemovalStageView
  | DeviceLimitDoneStageView
  | UnlinkMultipleDevicesErrorStageView;
