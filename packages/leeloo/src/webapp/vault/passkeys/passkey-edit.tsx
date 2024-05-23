import React from 'react';
import { Lee } from 'lee';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
import { TeamSpaceContextProvider } from 'team/settings/components/TeamSpaceContext';
import { PasskeyEditComponentProps, PasskeyEditPanelComponent, } from './passkey-edit-component';
interface Props extends PasskeyEditComponentProps {
    match: {
        params: {
            uuid: string;
        };
    };
    lee: Lee;
}
export const Connected = (props: Props) => {
    const { data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Passkey],
        ids: [`{${props.match.params.uuid}}`],
    });
    if (!data?.passkeysResult.items.length) {
        return null;
    }
    return (<TeamSpaceContextProvider lee={props.lee}>
      <PasskeyEditPanelComponent {...props} item={data.passkeysResult.items[0]}/>
    </TeamSpaceContextProvider>);
};
