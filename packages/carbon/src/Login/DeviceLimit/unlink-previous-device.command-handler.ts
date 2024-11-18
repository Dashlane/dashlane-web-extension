import { LoginServices } from "Login/dependencies";
import { sessionDidOpen } from "Login/LoginController";
import {
  unlinkingFailed,
  unlinkingSucceeded,
  unlinkPreviousDeviceRequested,
} from "Login/DeviceLimit/Store/loginDeviceLimitFlow/actions";
import {
  augmentDeviceLimitError,
  notifyDeviceLimitError,
} from "Login/DeviceLimit/error-handling.helpers";
import { sendExceptionLog } from "Logs/Exception";
import {
  UnlinkPreviousDeviceError,
  UnlinkPreviousDeviceResult,
} from "@dashlane/communication";
export async function unlinkPreviousDevice(
  services: LoginServices
): Promise<UnlinkPreviousDeviceResult> {
  const { storeService } = services;
  try {
    storeService.dispatch(unlinkPreviousDeviceRequested());
    await sessionDidOpen(services);
    storeService.dispatch(unlinkingSucceeded());
    return { success: true };
  } catch (error) {
    storeService.dispatch(unlinkingFailed());
    notifyDeviceLimitError(services, error);
    const augmentedError = augmentDeviceLimitError(
      error,
      "unlinkPreviousDevice"
    );
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: {
        code: UnlinkPreviousDeviceError.UnexpectedError,
      },
    };
  }
}
