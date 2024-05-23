import React from 'react';
import { useModuleQuery } from '@dashlane/framework-react';
import { Identity, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { Props as BaseProps } from 'webapp/personal-info/generic-edit';
import { IdentityEditPanel } from 'webapp/personal-info/identity/edit';
type Props = BaseProps<Identity>;
export const Connected = (props: Props) => {
    const { data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Identity],
        ids: [`{${props.match.params.uuid}}`],
    });
    return (<IdentityEditPanel {...props} item={data?.identitiesResult.items[0]}/>);
};
