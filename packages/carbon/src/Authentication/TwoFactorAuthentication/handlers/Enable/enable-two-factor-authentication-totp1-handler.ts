import { CoreServices } from "Services";
import { completeTotpActivationHandler } from "../complete-totp-activation-handler";
import { TwoFactorAuthenticationHandlerResult } from "../types";
export const enableTwoFactorAuthenticationTOTP1Handler = async (
  coreServices: CoreServices,
  authTicket: string
): Promise<TwoFactorAuthenticationHandlerResult> => {
  const completeTotpActivationResponse = await completeTotpActivationHandler(
    coreServices,
    authTicket
  );
  return completeTotpActivationResponse;
};
