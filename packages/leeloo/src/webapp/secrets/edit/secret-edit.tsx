import React from 'react';
import { Secret, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { SecretEditPanelComponent } from './secret-edit-component';
import { DataStatus, useModuleQueries, useModuleQuery, } from '@dashlane/framework-react';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
interface Props {
    match: {
        params: {
            uuid: string;
        };
    };
    onClose: () => void;
}
interface PropsWithSecret extends Props {
    secret: Secret;
}
const SecretEditComponent = (props: PropsWithSecret) => {
    const { secret } = props;
    const unlockerProps = useProtectedItemsUnlocker();
    const { getPermissionForItem, getSharingStatusForItem, getIsLastAdminForItem, } = useModuleQueries(sharingItemsApi, {
        getPermissionForItem: {
            queryParam: {
                itemId: secret.id,
            },
        },
        getSharingStatusForItem: {
            queryParam: {
                itemId: secret.id,
            },
        },
        getIsLastAdminForItem: {
            queryParam: {
                itemId: secret.id,
            },
        },
    }, []);
    if (getPermissionForItem.status !== DataStatus.Success ||
        getSharingStatusForItem.status !== DataStatus.Success ||
        getIsLastAdminForItem.status !== DataStatus.Success) {
        return null;
    }
    const { isShared, isSharedViaUserGroup } = getSharingStatusForItem.data;
    const { isLastAdmin } = getIsLastAdminForItem.data;
    return (<SecretEditPanelComponent {...props} {...unlockerProps} isShared={isShared} isAdmin={isShared && getPermissionForItem.data.permission === Permission.Admin} isSharedViaUserGroup={isSharedViaUserGroup} isLastAdmin={isLastAdmin}/>);
};
export const SecretEditPanel = (props: Props) => {
    const { data, status } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Secret],
        ids: [`{${props.match.params.uuid}}`],
    });
    if (status === DataStatus.Loading) {
        return null;
    }
    if (!data?.secretsResult.items.length) {
        props.onClose();
        return null;
    }
    return (<SecretEditComponent {...props} secret={data.secretsResult.items[0]}/>);
};
