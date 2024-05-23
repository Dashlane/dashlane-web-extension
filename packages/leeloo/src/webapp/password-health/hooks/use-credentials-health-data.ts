import { CredentialHealthDataView, passwordHealthApi, } from '@dashlane/password-security-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export interface UseCredentialHealthData {
    healthData: CredentialHealthDataView | null | undefined;
}
export const useCredentialHealthData = (credentialId: string): UseCredentialHealthData => {
    const { data } = useModuleQuery(passwordHealthApi, 'credentialHealthData', {
        credentialId,
    });
    return {
        healthData: data,
    };
};
