import { useState } from 'react';
import { useHistory, useLocation } from 'libs/router';
import { equals } from 'ramda';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { CredentialItemView, GroupRecipient, MemberPermission, NoteItemView, UserRecipient, } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { useModuleQuery } from '@dashlane/framework-react';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { FlexContainer } from '@dashlane/ui-components';
import { Secret, SecureNote, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { logSelectCredential, logSelectSecureNote, } from 'libs/logs/events/vault/select-item';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useCompromisedCredentialsAtRisk } from 'webapp/credentials/hooks/use-compromised-credentials';
import { CredentialTitle } from 'webapp/credentials/list/credential-title';
import Row from 'webapp/list-view/row';
import { EditPermission } from 'webapp/shared-access/edit-permission';
import { useItemItemGroup } from 'webapp/sharing-center/shared/useItemItemGroup';
import { useItemPermissionLevel } from 'webapp/sharing-center/shared/useItemPermissionLevel';
import { isItemACredential, isItemANote, isItemASecret, isItemOldSecureNote, isUserGroup, } from 'webapp/sharing-center/shared/items-list/util';
import { NoteTitle } from 'webapp/secure-notes/list/note-title';
import { convertNewSecureNoteToView, convertToSecureNoteView, } from 'webapp/secure-notes/utils';
import { PermissionBadge } from 'webapp/sharing-center/shared/items-list/permission-badge';
import { EditPermissionButton } from 'webapp/sharing-center/shared/items-list/edit-permission-button';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items/useProtectedItemsUnlocker';
import { CollectionTitle } from './collection-title';
import { SecretTitle } from 'webapp/secrets/list/secret-title';
const I18N_KEYS = {
    FULL_ACCESS_GROUP_ITEM: 'webapp_sharing_center_panel_items_full_access_info_group_item',
    FULL_ACCESS_GROUP_PASSWORD: 'webapp_sharing_center_panel_items_full_access_info_group_password',
    FULL_ACCESS_USER_ITEM: 'webapp_sharing_center_panel_items_full_access_info_user_item',
    FULL_ACCESS_USER_PASSWORD: 'webapp_sharing_center_panel_items_full_access_info_user_password',
    ITEM_IN_COLLECTION_TOOLTIP: 'webapp_sharing_collection_access_description_tooltip',
    LIMITED_ACCESS_GROUP_ITEM: 'webapp_sharing_center_panel_items_limited_access_info_group_item',
    LIMITED_ACCESS_GROUP_PASSWORD: 'webapp_sharing_center_panel_items_limited_access_info_group_password',
    LIMITED_ACCESS_USER_ITEM: 'webapp_sharing_center_panel_items_limited_access_info_user_item',
    LIMITED_ACCESS_USER_PASSWORD: 'webapp_sharing_center_panel_items_limited_access_info_user_password',
    LIMITED_ACCESS_YOU_ITEM: 'webapp_sharing_center_panel_items_limited_access_info_you_item',
    LIMITED_ACCESS_YOU_PASSWORD: 'webapp_sharing_center_panel_items_limited_access_info_you_password'
};
export interface CollectionItemView {
    id: string;
    title: string;
    url: string;
    login: string;
    isCollection?: true;
}
interface ItemRowProps {
    rowIndex: number;
    item: CredentialItemView | SecureNote | NoteItemView | Secret | CollectionItemView;
    entity: UserRecipient | GroupRecipient;
    isCredentialCompromised?: boolean;
    isItemInSharedCollection?: boolean;
    isCollectionList?: boolean;
}
const ItemRowInternal = ({ rowIndex, item, entity, isCredentialCompromised = false, isItemInSharedCollection = false, isCollectionList = false, }: ItemRowProps) => {
    const { translate } = useTranslate();
    const { itemGroupId, isReady: isItemGroupReady } = useItemItemGroup(item.id);
    const itemPermissionLevel = useItemPermissionLevel(item.id, entity);
    const { pathname } = useLocation();
    const [showEditPermissionDialog, setShowEditPermissionDialog] = useState(false);
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const { data: sharingData } = useModuleQuery(sharingItemsApi, 'getSharingStatusForItem', {
        itemId: item.id,
    });
    const { data: sharingPermission } = useModuleQuery(sharingItemsApi, 'getPermissionForItem', {
        itemId: item.id,
    });
    const isEditPermissionDisabled = sharingData?.isShared &&
        sharingPermission?.permission === Permission.Limited;
    const isItemNoteAndLocked = ((isItemANote(item) && item.isSecured) ||
        (isItemOldSecureNote(item) && item.secured)) &&
        !areProtectedItemsUnlocked;
    const TitleTag = () => {
        if (itemPermissionLevel.status !== DataStatus.Success) {
            return null;
        }
        const permissionLevel = itemPermissionLevel.data;
        if (permissionLevel === undefined) {
            return null;
        }
        const PERMISSIONS = {
            CREDENTIAL_USER_GROUP_NOT_ADMIN: {
                isCredential: true,
                isUserGroup: true,
                isAdmin: false,
            },
            CREDENTIAL_USER_GROUP_ADMIN: {
                isCredential: true,
                isUserGroup: true,
                isAdmin: true,
            },
            CREDENTIAL_USER_NOT_ADMIN: {
                isCredential: true,
                isUserGroup: false,
                isAdmin: false,
            },
            CREDENTIAL_USER_ADMIN: {
                isCredential: true,
                isUserGroup: false,
                isAdmin: true,
            },
            NOTE_USER_GROUP_NOT_ADMIN: {
                isCredential: false,
                isUserGroup: true,
                isAdmin: false,
            },
            NOTE_USER_GROUP_ADMIN: {
                isCredential: false,
                isUserGroup: true,
                isAdmin: true,
            },
            NOTE_USER_NOT_ADMIN: {
                isCredential: true,
                isUserGroup: true,
                isAdmin: false,
            },
            NOTE_USER_ADMIN: {
                isCredential: false,
                isUserGroup: false,
                isAdmin: true,
            },
        };
        const meta = {
            isCredential: isItemACredential(item),
            isUserGroup: isUserGroup(entity),
            isAdmin: permissionLevel === 'admin',
        };
        let tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_USER_ITEM);
        switch (true) {
            case equals(PERMISSIONS.CREDENTIAL_USER_GROUP_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.FULL_ACCESS_GROUP_PASSWORD);
                break;
            case equals(PERMISSIONS.CREDENTIAL_USER_GROUP_NOT_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_GROUP_PASSWORD);
                break;
            case equals(PERMISSIONS.CREDENTIAL_USER_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.FULL_ACCESS_USER_PASSWORD);
                break;
            case equals(PERMISSIONS.CREDENTIAL_USER_NOT_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_USER_PASSWORD);
                break;
            case equals(PERMISSIONS.NOTE_USER_GROUP_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.FULL_ACCESS_GROUP_ITEM);
                break;
            case equals(PERMISSIONS.NOTE_USER_GROUP_NOT_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_GROUP_ITEM);
                break;
            case equals(PERMISSIONS.NOTE_USER_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.FULL_ACCESS_USER_ITEM);
                break;
            case equals(PERMISSIONS.NOTE_USER_NOT_ADMIN, meta):
                tooltipText = translate(I18N_KEYS.LIMITED_ACCESS_USER_ITEM);
                break;
            default:
                break;
        }
        return (<PermissionBadge level={permissionLevel} tooltipText={tooltipText} tooltipPlacement={rowIndex === 0 ? 'bottom' : 'right'}/>);
    };
    const getRowData = () => {
        return [
            {
                key: 'name',
                content: (<FlexContainer flexDirection="row" justifyContent="space-between" alignItems="center">
            {isItemACredential(item) ? (<CredentialTitle credential={{
                            ...item,
                            itemName: item.title,
                            URL: item.url,
                            username: item.login,
                        }} showTitleIcons={false} tag={<TitleTag />} isCompromised={isCredentialCompromised} isShared={true}/>) : null}
            {isItemANote(item) ? (<NoteTitle note={convertNewSecureNoteToView(item)} showTitleIcons={false} tag={<TitleTag />}/>) : null}
            {!isItemANote(item) && isItemOldSecureNote(item) ? (<NoteTitle note={convertToSecureNoteView(item)} showTitleIcons={false} tag={<TitleTag />}/>) : null}
            {isItemASecret(item) ? (<SecretTitle secret={item} showTitleIcons={false} tag={<TitleTag />}/>) : null}
            {isCollectionList && 'login' in item ? (<CollectionTitle item={item} isInGroupList={entity.type !== 'user'}/>) : null}
          </FlexContainer>),
                sxProps: { width: 'auto', minHeight: '60px' },
            },
        ];
    };
    const getRowActions = () => {
        let tooltipTitle = '';
        if (isItemInSharedCollection || isCollectionList) {
            tooltipTitle = translate(I18N_KEYS.ITEM_IN_COLLECTION_TOOLTIP);
        }
        else if (isEditPermissionDisabled) {
            tooltipTitle = isItemACredential(item)
                ? translate(I18N_KEYS.LIMITED_ACCESS_YOU_PASSWORD)
                : translate(I18N_KEYS.LIMITED_ACCESS_YOU_ITEM);
        }
        return (<div sx={{ display: 'flex', alignItems: 'center', minHeight: '60px' }}>
        <EditPermissionButton onClick={() => {
                setShowEditPermissionDialog(true);
            }} isDisabled={isEditPermissionDisabled ||
                isItemInSharedCollection ||
                isCollectionList} tooltipTitle={tooltipTitle} tooltipPlacement={rowIndex === 0 ? 'bottom' : 'top'}/>
        <EditPermission isOpen={showEditPermissionDialog} onDismiss={() => setShowEditPermissionDialog(false)} isLoading={!isItemGroupReady ||
                itemPermissionLevel.status === DataStatus.Loading} itemGroupId={itemGroupId} originPermission={itemPermissionLevel.status === DataStatus.Success
                ? (itemPermissionLevel.data as MemberPermission)
                : 'limited'} recipient={entity}/>
      </div>);
    };
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const redirectToPanel = () => {
        const isCredential = isItemACredential(item);
        const isSecureNote = isItemANote(item) || isItemOldSecureNote(item);
        const isSecret = isItemASecret(item);
        const link = isCollectionList
            ? routes.userCollection(item.id)
            : routes.userVaultItem(item.id, isCredential
                ? VaultItemType.Credential
                : isSecureNote
                    ? VaultItemType.SecureNote
                    : VaultItemType.Secret, pathname);
        if (isCredential) {
            logSelectCredential(item.id);
        }
        else if (isSecureNote) {
            logSelectSecureNote(item.id);
        }
        else if (isSecret) {
        }
        if (isItemNoteAndLocked) {
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.SecureNote,
                successCallback: () => {
                    history.push({
                        pathname: link,
                    });
                },
            });
        }
        else {
            history.push({
                pathname: link,
            });
        }
    };
    return (<Row onClick={redirectToPanel} data={getRowData()} actions={getRowActions()} key={item.id} style={{ padding: '0' }}/>);
};
const CredentialRow = (props: ItemRowProps) => {
    const isCredentialCompromised = useCompromisedCredentialsAtRisk([props.item.id]).length === 1;
    return (<ItemRowInternal {...props} isCredentialCompromised={isCredentialCompromised}/>);
};
export const ItemRow = (props: ItemRowProps) => {
    return isItemACredential(props.item) ? (<CredentialRow {...props}/>) : (<ItemRowInternal {...props}/>);
};
