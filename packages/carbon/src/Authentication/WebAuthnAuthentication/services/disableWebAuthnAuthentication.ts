import {
  DisableWebAuthnAuthenticationError,
  DisableWebAuthnAuthenticationResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import { sendUserSettingsLog } from "UserSettingsLog/Services/send-user-settings-log";
export async function disableWebAuthnAuthentication(
  coreServices: CoreServices
): Promise<DisableWebAuthnAuthenticationResult> {
  const { webAuthnAuthenticationService, storeService } = coreServices;
  const login = userLoginSelector(storeService.getState());
  if (!login) {
    return {
      success: false,
      error: {
        code: DisableWebAuthnAuthenticationError.MISSING_LOGIN,
      },
    };
  }
  try {
    const wasDeactivationSuccessful =
      await webAuthnAuthenticationService.deactivate(login);
    if (!wasDeactivationSuccessful) {
      return {
        success: false,
        error: {
          code: DisableWebAuthnAuthenticationError.WEBAUTHN_SERVICE_DEACTIVATE_FAILED,
        },
      };
    }
    sendUserSettingsLog(coreServices);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: {
        code: DisableWebAuthnAuthenticationError.WEBAUTHN_SERVICE_DEACTIVATE_FAILED,
      },
    };
  }
}
