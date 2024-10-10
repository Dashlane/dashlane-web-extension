import { EmailTokenApiError, EmailTokenResult } from "@dashlane/communication";
import { requestEmailTokenVerification } from "Libs/DashlaneApi";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
export async function requestEmailToken(
  services: CoreServices
): Promise<EmailTokenResult> {
  try {
    const { storeService } = services;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    if (!login) {
      throw new Error(
        "[emailToken] - askServerToSendToken: no current authenticated user"
      );
    }
    await requestEmailTokenVerification(storeService, {
      login,
    });
  } catch (error) {
    return {
      success: false,
      error: {
        code: EmailTokenApiError,
        message: error.message,
      },
    };
  }
  return {
    success: true,
  };
}
