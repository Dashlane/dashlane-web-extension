import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { CoreServices } from "Services";
import { isApiError } from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { completeTotpActivation } from "Libs/DashlaneApi/services/authentication/complete-totp-activation";
import { TwoFactorAuthenticationHandlerResult } from "./types";
export const completeTotpActivationHandler = async (
  coreServices: CoreServices,
  authTicket: string
): Promise<TwoFactorAuthenticationHandlerResult> => {
  const { storeService } = coreServices;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  if (!login) {
    return {
      success: false,
      error: {
        code: AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
  const totpActivationResponse = await completeTotpActivation(
    storeService,
    login,
    {
      authTicket,
    }
  );
  if (isApiError(totpActivationResponse)) {
    return {
      success: false,
      error: {
        code: totpActivationResponse.code,
      },
    };
  }
  return { success: true };
};
