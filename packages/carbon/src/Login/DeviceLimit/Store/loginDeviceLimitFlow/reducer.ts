import {
  DEVICE_LIMIT_REMOVED,
  DEVICE_LIMIT_STATUS_UPDATED,
  LoginDeviceLimitFlowAction,
  MULTIPLE_DEVICES_LIMIT_REACHED,
  MULTIPLE_DEVICES_LIMIT_STILL_REACHED,
  ONE_DEVICE_LIMIT_REACHED,
  ONE_DEVICE_LIMIT_STILL_REACHED,
  REFRESH_DEVICE_LIMIT_STATUS_FAILED,
  UNLINK_MULTIPLE_DEVICES_ERROR,
  UNLINK_MULTIPLE_DEVICES_REQUESTED,
  UNLINK_PREVIOUS_DEVICE_REQUESTED,
  UNLINKING_FAILED,
  UNLINKING_SUCCEEDED,
} from "Login/DeviceLimit/Store/loginDeviceLimitFlow/actions";
import { LoginDeviceLimitState } from "Login/DeviceLimit/Store/loginDeviceLimitFlow/types";
import {
  atDeviceLimitDoneStage,
  atMultipleDevicesLimitReachedStage,
  atOneDeviceLimitReachedStage,
  atOpeningSessionAfterDeviceLimitRemovalStage,
  atRefreshingDeviceLimitStatusStage,
  atUnlinkingAndOpeningSessionStage,
  atUnlinkMultipleDevicesErrorStage,
} from "Login/DeviceLimit/device-limit-flow.factories";
import { assertUnreachable } from "Helpers/assert-unreachable";
import {
  DeviceLimitCommonContext,
  LimitedToMultipleDevices,
  LimitedToOneDevice,
  LoginDeviceLimitFlow,
  LoginDeviceLimitFlowStage,
  MultipleDevicesLimitReachedStage,
  OneDeviceLimitReachedStage,
  RefreshingDeviceLimitStatusStage,
  UnlinkingAndOpeningSessionStage,
  UnlinkMultipleDevicesErrorStage,
} from "@dashlane/communication";
const transitionFromNoStage = (
  state: null,
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitFlow | null => {
  if (action.type === ONE_DEVICE_LIMIT_REACHED) {
    return atOneDeviceLimitReachedStage({
      login: action.login,
      subscriptionCode: action.subscriptionCode,
      deviceLimitStatus: action.deviceLimitStatus,
    });
  } else if (action.type === MULTIPLE_DEVICES_LIMIT_REACHED) {
    return atMultipleDevicesLimitReachedStage({
      login: action.login,
      subscriptionCode: action.subscriptionCode,
      deviceLimitStatus: action.deviceLimitStatus,
    });
  }
  return state;
};
const transitionFromOneDeviceLimitReachedStage = (
  state: OneDeviceLimitReachedStage,
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitFlow => {
  switch (action.type) {
    case UNLINK_PREVIOUS_DEVICE_REQUESTED: {
      return atUnlinkingAndOpeningSessionStage(state);
    }
    case DEVICE_LIMIT_STATUS_UPDATED: {
      return atRefreshingDeviceLimitStatusStage(state);
    }
  }
  return state;
};
const transitionFromMultipleDevicesLimitReachedStage = (
  state: MultipleDevicesLimitReachedStage,
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitFlow => {
  switch (action.type) {
    case UNLINK_MULTIPLE_DEVICES_REQUESTED: {
      return atUnlinkingAndOpeningSessionStage(state);
    }
    case DEVICE_LIMIT_STATUS_UPDATED: {
      return atRefreshingDeviceLimitStatusStage(state);
    }
  }
  return state;
};
const transitionFromMultipleDevicesLimitErrorStage = (
  state: UnlinkMultipleDevicesErrorStage,
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitFlow => {
  switch (action.type) {
    case UNLINK_MULTIPLE_DEVICES_ERROR: {
      return atUnlinkMultipleDevicesErrorStage({
        ...state,
        retryPayload: action.retryPayload,
      });
    }
    case UNLINK_MULTIPLE_DEVICES_REQUESTED: {
      return atUnlinkingAndOpeningSessionStage(state);
    }
    case UNLINKING_SUCCEEDED: {
      return atDeviceLimitDoneStage(state);
    }
  }
  return state;
};
const transitionBackToPreviousDeviceLimitStage = (
  state: {
    deviceLimitStatus: LimitedToMultipleDevices | LimitedToOneDevice;
  } & DeviceLimitCommonContext
) => {
  const { deviceLimitStatus } = state;
  switch (deviceLimitStatus._tag) {
    case "limitedToOneDevice":
      return atOneDeviceLimitReachedStage({
        ...state,
        deviceLimitStatus,
      });
    case "limitedToMultipleDevices":
      return atMultipleDevicesLimitReachedStage({
        ...state,
        deviceLimitStatus,
      });
    default:
      assertUnreachable(deviceLimitStatus);
  }
};
const transitionFromRefreshingDeviceLimitStatusStage = (
  state: RefreshingDeviceLimitStatusStage,
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitFlow => {
  switch (action.type) {
    case ONE_DEVICE_LIMIT_STILL_REACHED: {
      return atOneDeviceLimitReachedStage({
        ...state,
        deviceLimitStatus: action.updatedDeviceLimitStatus,
      });
    }
    case MULTIPLE_DEVICES_LIMIT_STILL_REACHED: {
      return atMultipleDevicesLimitReachedStage({
        ...state,
        deviceLimitStatus: action.updatedDeviceLimitStatus,
      });
    }
    case REFRESH_DEVICE_LIMIT_STATUS_FAILED: {
      return transitionBackToPreviousDeviceLimitStage(state);
    }
    case DEVICE_LIMIT_REMOVED: {
      return atOpeningSessionAfterDeviceLimitRemovalStage(state);
    }
  }
  return state;
};
const transitionFromUnlinkingAndOpeningSession = (
  state: UnlinkingAndOpeningSessionStage,
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitFlow => {
  switch (action.type) {
    case UNLINKING_SUCCEEDED: {
      return atDeviceLimitDoneStage(state);
    }
    case UNLINKING_FAILED: {
      return transitionBackToPreviousDeviceLimitStage(state);
    }
    case UNLINK_MULTIPLE_DEVICES_ERROR: {
      return atUnlinkMultipleDevicesErrorStage({
        ...state,
        retryPayload: action.retryPayload,
      });
    }
  }
  return state;
};
export default (
  state = getEmptyLoginDeviceLimitFlowState(),
  action: LoginDeviceLimitFlowAction
): LoginDeviceLimitState => {
  if (state.flow === null) {
    return {
      flow: transitionFromNoStage(null, action),
    };
  }
  switch (state.flow.name) {
    case LoginDeviceLimitFlowStage.OneDeviceLimitReached:
      return {
        flow: transitionFromOneDeviceLimitReachedStage(state.flow, action),
      };
    case LoginDeviceLimitFlowStage.UnlinkingMultipleDevicesError:
      return {
        flow: transitionFromMultipleDevicesLimitErrorStage(state.flow, action),
      };
    case LoginDeviceLimitFlowStage.MultipleDevicesLimitReached:
      return {
        flow: transitionFromMultipleDevicesLimitReachedStage(
          state.flow,
          action
        ),
      };
    case LoginDeviceLimitFlowStage.RefreshingDeviceLimitStatus:
      return {
        flow: transitionFromRefreshingDeviceLimitStatusStage(
          state.flow,
          action
        ),
      };
    case LoginDeviceLimitFlowStage.UnlinkingAndOpeningSession: {
      return {
        flow: transitionFromUnlinkingAndOpeningSession(state.flow, action),
      };
    }
    case LoginDeviceLimitFlowStage.OpeningSessionAfterDeviceLimitRemoval:
    case LoginDeviceLimitFlowStage.DeviceLimitDone:
      return state;
    default:
      return assertUnreachable(state.flow);
  }
};
export function getEmptyLoginDeviceLimitFlowState(): LoginDeviceLimitState {
  return {
    flow: null,
  };
}
