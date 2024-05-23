import { passwordHealthApi } from '@dashlane/password-security-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export type UseCompromisedCredentialsAtRisk = string[];
export const useCompromisedCredentialsAtRisk = (credentialIds: string[]): UseCompromisedCredentialsAtRisk => {
    const { data } = useModuleQuery(passwordHealthApi, 'compromisedCredentials', {
        credentialIds,
    });
    return data ?? [];
};
