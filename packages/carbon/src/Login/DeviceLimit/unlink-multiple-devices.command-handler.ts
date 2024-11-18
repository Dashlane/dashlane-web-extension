import {
  LoginNotificationType,
  UNEXPECTED_ERROR,
  UnlinkMultipleDevicesError,
  UnlinkMultipleDevicesRequest,
  UnlinkMultipleDevicesResult,
  UnlinkMultipleDevicesResultError,
  USER_STILL_OVERFLOWING,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { premiumStatusSelector, userLoginSelector } from "Session/selectors";
import {
  CLIENT_DEVICES_NOT_FOUND,
  deactivateDevices,
  isApiError,
  PAIRING_GROUPS_NOT_FOUND,
} from "Libs/DashlaneApi";
import { isMultipleDevicesLimitApplicable } from "Login/DeviceLimit/multiple-devices-limit.domain";
import { sessionDidOpen } from "Login/LoginController";
import { addNewLoginNotification } from "InMemoryInterSessionUnsyncedSettings/Store/loginNotifications/actions";
import { makeDeviceInfoService } from "Login/DeviceLimit/device-info.service";
import {
  deviceLimitStatusUpdated,
  multipleDevicesLimitStillReached,
  unlinkingFailed,
  unlinkingMultipleDevicesRequested,
  unlinkingSucceeded,
  unlinkMultipleDevicesErrorReached,
} from "Login/DeviceLimit/Store/loginDeviceLimitFlow/actions";
import {
  augmentDeviceLimitError,
  notifyDeviceLimitError,
} from "Login/DeviceLimit/error-handling.helpers";
import { sendExceptionLog } from "Logs/Exception";
import { deviceKeysSelector } from "Authentication";
const deactivateAndDisplayUnlinkingError = async (
  services: CoreServices,
  login: string,
  params: UnlinkMultipleDevicesRequest
) => {
  const { storeService } = services;
  const errorHandling = (error: any) => {
    const action = unlinkMultipleDevicesErrorReached({
      retryPayload: params,
    });
    storeService.dispatch(action);
    return {
      success: false,
      error: {
        code: error.code as UnlinkMultipleDevicesError,
      },
    };
  };
  try {
    const responseUnlinkMultipleDevices = await deactivateDevices(
      storeService,
      login,
      params
    );
    if (isApiError(responseUnlinkMultipleDevices)) {
      if (
        responseUnlinkMultipleDevices.code !== CLIENT_DEVICES_NOT_FOUND &&
        responseUnlinkMultipleDevices.code !== PAIRING_GROUPS_NOT_FOUND
      ) {
        return errorHandling(responseUnlinkMultipleDevices);
      }
    }
  } catch (error) {
    return errorHandling(error);
  }
};
const displayStillOverflowingNotification = async (
  services: CoreServices,
  login: string
): Promise<false | UnlinkMultipleDevicesResultError> => {
  const { storeService } = services;
  const state = storeService.getState();
  const premiumStatus = premiumStatusSelector(state);
  const deviceInfoService = makeDeviceInfoService(storeService);
  const devicesInfo = await deviceInfoService.getDevicesInfo(login);
  const deviceKeys = deviceKeysSelector(storeService.getState());
  const multipleDevicesLimitResult = isMultipleDevicesLimitApplicable(
    devicesInfo,
    premiumStatus,
    deviceKeys
  );
  if (multipleDevicesLimitResult._tag === "limitedToMultipleDevices") {
    storeService.dispatch(deviceLimitStatusUpdated());
    const notifyErrorAction = addNewLoginNotification({
      type: LoginNotificationType.UNKNOWN_ERROR,
      message: `${USER_STILL_OVERFLOWING}`,
    });
    storeService.dispatch(notifyErrorAction);
    const action = multipleDevicesLimitStillReached({
      updatedDeviceLimitStatus: {
        _tag: "limitedToMultipleDevices",
        devices: multipleDevicesLimitResult.devices,
      },
    });
    storeService.dispatch(action);
    return {
      success: false,
      error: {
        code: USER_STILL_OVERFLOWING,
      },
    };
  }
  return false;
};
export const unlinkMultipleDevices = async (
  services: CoreServices,
  params: UnlinkMultipleDevicesRequest
): Promise<UnlinkMultipleDevicesResult> => {
  const { storeService, sessionService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  storeService.dispatch(unlinkingMultipleDevicesRequested());
  const shouldDisplayUnlinkingError = await deactivateAndDisplayUnlinkingError(
    services,
    login,
    params
  );
  if (shouldDisplayUnlinkingError) {
    return shouldDisplayUnlinkingError;
  }
  const shouldDisplayStillOverflowingNotification =
    await displayStillOverflowingNotification(services, login);
  if (shouldDisplayStillOverflowingNotification) {
    return shouldDisplayStillOverflowingNotification;
  }
  try {
    await sessionDidOpen(services);
    storeService.dispatch(unlinkingSucceeded());
    return { success: true };
  } catch (err) {
    sessionService.close(false);
    notifyDeviceLimitError(services, err);
    storeService.dispatch(unlinkingFailed());
    sendExceptionLog({
      error: augmentDeviceLimitError(err, "unlinkMultipleDevices"),
    });
    return {
      success: false,
      error: {
        code: UNEXPECTED_ERROR,
      },
    };
  }
};
