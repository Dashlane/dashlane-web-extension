import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { CoreServices } from "Services";
import { deactivateTotpVerification, isApiError } from "Libs/DashlaneApi";
import { TwoFactorAuthenticationHandlerResult } from "../types";
export const disableTwoFactorAuthenticationTOTP1Handler = async (
  coreServices: CoreServices,
  authTicket: string
): Promise<TwoFactorAuthenticationHandlerResult> => {
  const { storeService } = coreServices;
  const { login } = storeService.getAccountInfo();
  const deactivateTotpVerificationResponse = await deactivateTotpVerification(
    storeService,
    login,
    { authTicket }
  );
  if (isApiError(deactivateTotpVerificationResponse)) {
    return {
      success: false,
      error: {
        code: AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
  return {
    success: true,
  };
};
