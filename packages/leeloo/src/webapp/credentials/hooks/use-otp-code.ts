import { otpApi } from "@dashlane/password-security-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
export const OTP_DEFAULT_CYCLE_PERIOD_MS = 30 * 1000;
export const OTP_ALERT_THRESHOLD_MS = 5 * 1000;
export function useOTPCode(secretOrUrl: string) {
  return useModuleQuery(otpApi, "otpCodeForSecretOrUrl", {
    secretOrUrl,
  });
}
