import { HookResultOf } from '@dashlane/framework-react/src/hooks/types-queries';
import { useModuleQuery } from '@dashlane/framework-react';
import { otpApi, OtpCodeQuery } from '@dashlane/password-security-contracts';
export function useCredentialOTPData(credentialId: string): HookResultOf<typeof OtpCodeQuery> {
    return useModuleQuery(otpApi, 'otpCode', { credentialId });
}
