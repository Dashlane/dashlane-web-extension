import { otpApi, OtpCodeForSecretOrUrlQuery, } from '@dashlane/password-security-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
import { HookResultOf } from '@dashlane/framework-react/src/hooks/types-queries';
export const OTP_DEFAULT_CYCLE_PERIOD_MS = 30 * 1000;
export const OTP_ALERT_THRESHOLD_MS = 5 * 1000;
export function useOTPCode(secretOrUrl: string): HookResultOf<typeof OtpCodeForSecretOrUrlQuery> {
    return useModuleQuery(otpApi, 'otpCodeForSecretOrUrl', {
        secretOrUrl,
    });
}
