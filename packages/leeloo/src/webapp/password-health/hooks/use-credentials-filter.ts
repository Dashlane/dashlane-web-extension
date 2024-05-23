import { HealthFilter, passwordHealthApi, PasswordHealthCredentialView, } from '@dashlane/password-security-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export interface UseCredentialsFilter {
    filteredCredentials: PasswordHealthCredentialView[];
}
export const useCredentialsFilter = (healthFilter: HealthFilter, spaceId: string | null): UseCredentialsFilter => {
    const { data } = useModuleQuery(passwordHealthApi, 'filterCredentials', {
        healthFilter,
        spaceId,
    });
    return {
        filteredCredentials: data ?? [],
    };
};
