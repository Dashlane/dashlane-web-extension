import React from 'react';
import { useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType, Website, } from '@dashlane/vault-contracts';
import { Props as BaseProps } from 'webapp/personal-info/generic-edit';
import { WebsiteEditPanel } from 'webapp/personal-info/website/edit';
type Props = BaseProps<Website>;
export const Connected = (props: Props) => {
    const { data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Website],
        ids: [`{${props.match.params.uuid}}`],
    });
    return <WebsiteEditPanel {...props} item={data?.websitesResult.items[0]}/>;
};
