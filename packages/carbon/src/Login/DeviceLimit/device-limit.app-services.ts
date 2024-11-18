import { premiumStatusSelector, userLoginSelector } from "Session/selectors";
import { pairingIdSelector } from "Session/Pairing/pairing.selectors";
import { LoginServices } from "Login/dependencies";
import { isOneDeviceLimitApplicable } from "Login/DeviceLimit/one-device-limit.domain";
import { isMultipleDevicesLimitApplicable } from "Login/DeviceLimit/multiple-devices-limit.domain";
import { makeDeviceInfoService } from "Login/DeviceLimit/device-info.service";
import {
  limitedToMultipleDevices,
  limitedToOneDevice,
  noDeviceLimit,
} from "Login/DeviceLimit/device-limit.factories";
import {
  multipleDevicesLimitReached,
  oneDeviceLimitReached,
} from "Login/DeviceLimit/Store/loginDeviceLimitFlow/actions";
import { deviceKeysSelector } from "Authentication";
import { isSSOUserSelector } from "Session/sso.selectors";
import { isCarbonError } from "Libs/Error";
import { HttpError, HttpErrorCode } from "Libs/Http";
import {
  DeviceLimitStatus,
  LimitedToMultipleDevices,
  LimitedToOneDevice,
} from "@dashlane/communication";
import { getDeviceAccessKeysFromSession } from "Authentication/selectors";
const notApplicableTimeout = (): Promise<DeviceLimitStatus> =>
  new Promise((resolve) => setTimeout(() => resolve(noDeviceLimit()), 3000));
const triggerGetDeviceLimitStatusFailed = (error: Error) => {
  if (
    !isCarbonError(error, HttpError, HttpErrorCode.NETWORK_ERROR) &&
    !isCarbonError(error, HttpError, HttpErrorCode.CONNECTION_ABORTED) &&
    !isCarbonError(error, HttpError, HttpErrorCode.CONNECTION_TIMED_OUT)
  ) {
    throw error;
  }
  return noDeviceLimit();
};
export const attemptGetDeviceLimitStatus = async (
  services: LoginServices
): Promise<DeviceLimitStatus> => {
  try {
    return await Promise.race([
      getDeviceLimitStatus(services),
      notApplicableTimeout(),
    ]);
  } catch (e) {
    return triggerGetDeviceLimitStatusFailed(e);
  }
};
export const getDeviceLimitStatus = async (
  services: LoginServices
): Promise<DeviceLimitStatus> => {
  const { storeService, moduleClients } = services;
  const state = storeService.getState();
  const isSSOUser = isSSOUserSelector(state);
  if (isSSOUser) {
    return noDeviceLimit();
  }
  const pairingId = pairingIdSelector(state);
  const premiumStatus = premiumStatusSelector(state);
  const login = userLoginSelector(state);
  const deviceInfoService = makeDeviceInfoService(storeService);
  const devicesInfo = await deviceInfoService.getDevicesInfo(login);
  const thisDeviceId = await getDeviceAccessKeysFromSession(
    moduleClients.session,
    login
  );
  const deviceKeys = deviceKeysSelector(storeService.getState());
  const oneDeviceLimitStatus = isOneDeviceLimitApplicable(
    pairingId,
    devicesInfo,
    thisDeviceId,
    premiumStatus
  );
  if (oneDeviceLimitStatus._tag === "limitedToOneDevice") {
    return limitedToOneDevice(oneDeviceLimitStatus.bucketOwner);
  }
  const multipleDevicesLimitResult = isMultipleDevicesLimitApplicable(
    devicesInfo,
    premiumStatus,
    deviceKeys
  );
  if (multipleDevicesLimitResult._tag === "limitedToMultipleDevices") {
    return limitedToMultipleDevices(multipleDevicesLimitResult.devices);
  }
  return noDeviceLimit();
};
export const startDeviceLimitFlow = async (
  services: LoginServices,
  deviceLimitStatus: LimitedToOneDevice | LimitedToMultipleDevices
) => {
  const { sessionService, storeService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  const userSessionService = sessionService.getInstance().user;
  const subscriptionCode = await userSessionService.fetchSubscriptionCode();
  if (deviceLimitStatus._tag === "limitedToOneDevice") {
    const action = oneDeviceLimitReached({
      deviceLimitStatus,
      subscriptionCode,
      login,
    });
    storeService.dispatch(action);
  } else if (deviceLimitStatus._tag === "limitedToMultipleDevices") {
    const action = multipleDevicesLimitReached({
      deviceLimitStatus,
      subscriptionCode,
      login,
    });
    storeService.dispatch(action);
  }
};
