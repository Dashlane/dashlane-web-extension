import { DataStatus, useFeatureFlips, useModuleQuery, } from '@dashlane/framework-react';
import { VaultItemsCrudFeatureFlips } from '@dashlane/vault-core';
import { SortDirection, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
export const useIsPasskeysSidemenuEnabled = (): boolean => {
    const retrievedFeatureFlips = useFeatureFlips();
    const isPasskeysEnabled = retrievedFeatureFlips.status === DataStatus.Success &&
        (!!retrievedFeatureFlips.data[VaultItemsCrudFeatureFlips.PasskeysInVaultProd] ||
            !!retrievedFeatureFlips.data[VaultItemsCrudFeatureFlips.PasskeysInVaultDev]);
    const { data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Passkey],
        propertySorting: {
            property: 'creationDatetime',
            direction: SortDirection.Descend,
        },
    });
    return Boolean(data?.passkeysResult.matchCount && isPasskeysEnabled);
};
