import { sendExceptionLog } from "Logs/Exception";
import { LoginServices } from "Login/dependencies";
import { sessionDidOpen } from "Login/LoginController";
import {
  augmentDeviceLimitError,
  notifyDeviceLimitError,
} from "Login/DeviceLimit/error-handling.helpers";
import {
  deviceLimitRemoved,
  multipleDevicesLimitStillReached,
  oneDeviceLimitStillReached,
  refreshDeviceLimitStatusFailed,
  sessionOpenedAfterDeviceLimitRemoval,
} from "Login/DeviceLimit/Store/loginDeviceLimitFlow/actions";
import { getDeviceLimitStatus } from "Login/DeviceLimit/device-limit.app-services";
const openSessionAfterDeviceLimitRemoval = async (services: LoginServices) => {
  const { sessionService, storeService } = services;
  try {
    await sessionDidOpen(services);
    storeService.dispatch(sessionOpenedAfterDeviceLimitRemoval());
  } catch (error) {
    notifyDeviceLimitError(services, error);
    const augmentedError = augmentDeviceLimitError(
      error,
      "openSessionAfterDeviceLimitRemoval"
    );
    sendExceptionLog({ error: augmentedError });
    sessionService.close();
  }
};
export const refreshDeviceLimitStatus = async (services: LoginServices) => {
  const { sessionService, storeService } = services;
  try {
    const userSessionService = sessionService.getInstance().user;
    await userSessionService.refreshSessionData();
    const status = await getDeviceLimitStatus(services);
    if (status._tag === "noDeviceLimit") {
      storeService.dispatch(deviceLimitRemoved());
      await openSessionAfterDeviceLimitRemoval(services);
    } else if (status._tag === "limitedToOneDevice") {
      const action = oneDeviceLimitStillReached({
        updatedDeviceLimitStatus: status,
      });
      storeService.dispatch(action);
    } else if (status._tag === "limitedToMultipleDevices") {
      const action = multipleDevicesLimitStillReached({
        updatedDeviceLimitStatus: status,
      });
      storeService.dispatch(action);
    }
  } catch (error) {
    storeService.dispatch(refreshDeviceLimitStatusFailed());
    const augmentedError = augmentDeviceLimitError(
      error,
      "refreshDeviceLimitStatus"
    );
    sendExceptionLog({ error: augmentedError });
  }
};
