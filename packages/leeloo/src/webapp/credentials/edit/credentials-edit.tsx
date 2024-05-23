import React from 'react';
import { DataStatus, useModuleQueries, useModuleQuery, } from '@dashlane/framework-react';
import { Credential, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { linkedWebsitesApi } from '@dashlane/autofill-contracts';
import { useSpaces } from 'libs/carbon/hooks/useSpaces';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { CredentialEditPanelComponent } from './credentials-edit-component';
interface Props {
    match: {
        params: {
            uuid: string;
        };
    };
    onClose: () => void;
}
interface PropsWithCredential extends Props {
    credential: Credential;
}
const CredentialEditComponent = (props: PropsWithCredential) => {
    const { credential } = props;
    const activeSpacesResult = useSpaces();
    const unlockerProps = useProtectedItemsUnlocker();
    const dashlaneDefinedLinkedWebsitesResult = useModuleQuery(linkedWebsitesApi, 'getDashlaneDefinedLinkedWebsites', {
        url: credential.URL,
    });
    const credentialPreferencesResult = useModuleQuery(vaultItemsCrudApi, 'tempCredentialPreferences', {
        credentialId: credential.id,
    });
    const { getPermissionForItem, getSharingStatusForItem, getIsLastAdminForItem, } = useModuleQueries(sharingItemsApi, {
        getPermissionForItem: {
            queryParam: {
                itemId: credential.id,
            },
        },
        getSharingStatusForItem: {
            queryParam: {
                itemId: credential.id,
            },
        },
        getIsLastAdminForItem: {
            queryParam: {
                itemId: credential.id,
            },
        },
    }, []);
    if (credentialPreferencesResult.status !== DataStatus.Success ||
        dashlaneDefinedLinkedWebsitesResult.status !== DataStatus.Success ||
        getPermissionForItem.status !== DataStatus.Success ||
        getSharingStatusForItem.status !== DataStatus.Success ||
        activeSpacesResult.status !== DataStatus.Success ||
        getIsLastAdminForItem.status !== DataStatus.Success) {
        return null;
    }
    const { isShared, isSharedViaUserGroup } = getSharingStatusForItem.data;
    const { isLastAdmin } = getIsLastAdminForItem.data;
    return (<CredentialEditPanelComponent {...props} {...unlockerProps} activeSpaces={activeSpacesResult.data} dashlaneDefinedLinkedWebsites={dashlaneDefinedLinkedWebsitesResult.data} credentialPreferences={credentialPreferencesResult.data} isShared={isShared} isAdmin={isShared && getPermissionForItem.data.permission === Permission.Admin} isSharedViaUserGroup={isSharedViaUserGroup} isLastAdmin={isLastAdmin}/>);
};
export const CredentialEditPanel = (props: Props) => {
    const { data, status } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.Credential],
        ids: [`{${props.match.params.uuid}}`],
    });
    if (status === DataStatus.Loading) {
        return null;
    }
    if (!data?.credentialsResult.items.length) {
        props.onClose();
        return null;
    }
    return (<CredentialEditComponent {...props} credential={data.credentialsResult.items[0]}/>);
};
