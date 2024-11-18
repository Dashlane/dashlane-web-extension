import {
  LoginDeviceLimitFlow,
  LoginDeviceLimitFlowStage,
  LoginDeviceLimitFlowView,
  MultipleDevicesLimitReachedStage,
  MultipleDevicesLimitReachedStageView,
  OneDeviceLimitReachedStage,
  OneDeviceLimitReachedStageView,
  UnlinkMultipleDevicesErrorStage,
  UnlinkMultipleDevicesErrorStageView,
} from "@dashlane/communication";
import { toPreviousDeviceInfo } from "Login/DeviceLimit/one-device-limit.view-mappers";
import { toDeviceToDeactivateInfoView } from "Login/DeviceLimit/multiple-devices-limit.view-mappers";
import { assertUnreachable } from "Helpers/assert-unreachable";
const toOneDeviceLimitReachedStageView = (
  stage: OneDeviceLimitReachedStage
): OneDeviceLimitReachedStageView => ({
  name: LoginDeviceLimitFlowStage.OneDeviceLimitReached,
  login: stage.login,
  previousDevice: toPreviousDeviceInfo(stage.deviceLimitStatus.bucketOwner),
  subscriptionCode: stage.subscriptionCode,
});
export const toMultipleDevicesLimitReachedStageView = (
  stage: MultipleDevicesLimitReachedStage
): MultipleDevicesLimitReachedStageView => ({
  name: LoginDeviceLimitFlowStage.MultipleDevicesLimitReached,
  login: stage.login,
  devicesToDeactivate: stage.deviceLimitStatus.devices.map(
    toDeviceToDeactivateInfoView
  ),
  subscriptionCode: stage.subscriptionCode,
});
export const toMultipleDevicesLimitErrorStageView = (
  stage: UnlinkMultipleDevicesErrorStage
): UnlinkMultipleDevicesErrorStageView => ({
  name: LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError,
  login: stage.login,
  retryPayload: stage.retryPayload,
  subscriptionCode: stage.subscriptionCode,
});
const toSimpleDeviceLimitView = <StageName extends LoginDeviceLimitFlowStage>(
  stageName: StageName,
  login: string
) => ({
  name: stageName,
  login,
});
export const toLoginDeviceLimitFlowView = (
  flow: LoginDeviceLimitFlow
): LoginDeviceLimitFlowView => {
  switch (flow.name) {
    case LoginDeviceLimitFlowStage.OneDeviceLimitReached: {
      return toOneDeviceLimitReachedStageView(flow);
    }
    case LoginDeviceLimitFlowStage.MultipleDevicesLimitReached: {
      return toMultipleDevicesLimitReachedStageView(flow);
    }
    case LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession:
    case LoginDeviceLimitFlowStage.DeviceLimitDone:
    case LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus:
    case LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval:
      return toSimpleDeviceLimitView(flow.name, flow.login);
    case LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError:
      return toMultipleDevicesLimitErrorStageView(flow);
    default:
      return assertUnreachable(flow);
  }
};
