import { useModuleCommands } from '@dashlane/framework-react';
import { passwordHealthApi } from '@dashlane/password-security-contracts';
export interface UseIsCredentialExcluded {
    updateIsCredentialExcluded: (credentialId: string, excluded: boolean) => void;
}
export const useIsCredentialExcluded = (): UseIsCredentialExcluded => {
    const { updateIsCredentialExcluded } = useModuleCommands(passwordHealthApi);
    return {
        updateIsCredentialExcluded: (credentialId, excluded) => {
            updateIsCredentialExcluded({ credentialId, excluded });
        },
    };
};
