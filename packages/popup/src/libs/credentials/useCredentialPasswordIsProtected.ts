import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi } from '@dashlane/vault-contracts';
import { useProtectPasswordsSetting } from 'src/libs/api/protectedItemsUnlocker/useProtectPasswordsSetting';
export function useCredentialPasswordIsProtected(credentialId: string): boolean | null {
    const mpSettingsResponse = useProtectPasswordsSetting();
    const { data, status } = useModuleQuery(vaultItemsCrudApi, 'tempCredentialPreferences', { credentialId });
    if (mpSettingsResponse.status !== DataStatus.Success ||
        status !== DataStatus.Success) {
        return null;
    }
    const globallyRequireMP = mpSettingsResponse.data;
    return data.requireMasterPassword || globallyRequireMP;
}
