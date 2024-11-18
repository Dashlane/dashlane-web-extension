import {
  AbortDeviceLimitFlowError,
  AbortDeviceLimitFlowResult,
} from "@dashlane/communication";
import { LoginServices } from "Login/dependencies";
import { augmentDeviceLimitError } from "Login/DeviceLimit/error-handling.helpers";
import { sendExceptionLog } from "Logs/Exception";
export async function abortDeviceLimitFlow(
  services: LoginServices
): Promise<AbortDeviceLimitFlowResult> {
  const { sessionService } = services;
  try {
    await sessionService.getInstance().user.closeSession();
    return { success: true };
  } catch (error) {
    const augmentedError = augmentDeviceLimitError(
      error,
      "abortDeviceLimitFlow"
    );
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: {
        code: AbortDeviceLimitFlowError.UnexpectedError,
      },
    };
  }
}
