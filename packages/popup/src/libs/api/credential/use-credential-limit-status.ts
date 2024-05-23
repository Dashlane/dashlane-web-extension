import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { passwordLimitApi } from '@dashlane/vault-contracts';
const PASSWORD_NEAR_LIMIT_THRESHOLD = 5;
export type UseCredentialLimitResult = {
    isLoading: true;
} | {
    isLoading: false;
    shouldShowNearLimitContent: boolean;
    shouldShowAtOrOverLimitContent: boolean;
    passwordsLeft?: number;
};
export function useCredentialLimitStatus(): UseCredentialLimitResult {
    const credentialLimitStatus = useModuleQuery(passwordLimitApi, 'getPasswordLimitStatus');
    if (credentialLimitStatus.status !== DataStatus.Success) {
        return { isLoading: true };
    }
    const { hasLimit, passwordsLeft } = credentialLimitStatus.data;
    if (!hasLimit || passwordsLeft === undefined) {
        return {
            isLoading: false,
            shouldShowAtOrOverLimitContent: false,
            shouldShowNearLimitContent: false,
        };
    }
    const shouldShowNearLimitContent = passwordsLeft > 0 && passwordsLeft <= PASSWORD_NEAR_LIMIT_THRESHOLD;
    const shouldShowAtOrOverLimitContent = passwordsLeft <= 0;
    return {
        isLoading: false,
        shouldShowNearLimitContent,
        shouldShowAtOrOverLimitContent,
        passwordsLeft,
    };
}
