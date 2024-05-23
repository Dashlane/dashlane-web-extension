import { useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi } from '@dashlane/vault-contracts';
import { getHeaderBackgroundColor } from 'src/app/vault/detail-views/helpers';
export const useDomainIconDetails = (domain: string) => {
    const { data: domainIconDetails } = useModuleQuery(vaultItemsCrudApi, 'domainIconDetails', {
        domain,
    });
    const iconSource = domainIconDetails?.urls['46x30@2x'] as string;
    const backgroundColor = getHeaderBackgroundColor(domainIconDetails?.backgroundColor).backgroundColor;
    return { domainIconDetails, iconSource, backgroundColor };
};
