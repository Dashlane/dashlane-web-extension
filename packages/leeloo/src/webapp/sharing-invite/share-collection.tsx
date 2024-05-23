import React, { Fragment, useCallback, useEffect, useMemo, useState, } from 'react';
import { isEqual } from 'lodash';
import { jsx } from '@dashlane/design-system';
import { ClickOrigin, Origin, SharingFlowType, UserSharingOutcomeEvent, } from '@dashlane/hermes';
import { Permission, ShareableCollection, SharedCollectionRole, SharedCollectionUserGroupRecipient, SharedCollectionUserRecipient, sharingCollectionsApi, } from '@dashlane/sharing-contracts';
import { AlertSeverity } from '@dashlane/ui-components';
import { VaultItemType } from '@dashlane/vault-contracts';
import { useEventWrapper, useFeatureFlips, useModuleCommands, } from '@dashlane/framework-react';
import { isFailure } from '@dashlane/framework-types';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { SharingInviteStep } from './types';
import { logEvent } from 'libs/logs/logEvent';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { CollectionRecipientsStep, CollectionSharingRoles, } from './recipients/sharing-collection-recipients';
import { PermissionStep } from './permission';
import { CollectionSharingPaywall, TrialBusinessCollectionSharingInfobox, useCollectionSharingStatus, } from 'webapp/paywall/paywall/collection-sharing';
import { AdminSharingCollectionPaywall } from './paywall/admin-sharing-collection-paywall';
import { NonAdminSharingCollectionPaywall } from './paywall/non-admin-sharing-collection-paywall';
const I18N_KEYS = {
    COLLECTION_SHARE_SUCCESS: 'webapp_sharing_invite_collection_share_success_message',
    COLLECTION_SHARE_ERROR: 'webapp_sharing_invite_collection_share_error',
};
const EDITOR_MANAGER_FEATURE_FLIP_DEV = 'sharingVault_web_Collection_Editor_Manager_dev';
const EDITOR_MANAGER_FEATURE_FLIP_PROD = 'sharingVault_web_Collection_Editor_Manager_prod';
const ITEM_PERMISSIONS_FEATURE_FLIP_DEV = 'sharingVault_web_Collection_Item_Permissions_dev';
interface ShareCollectionProps {
    step: SharingInviteStep;
    newUsers: string[];
    onCheckGroup: (groupId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    goToStep: (step: SharingInviteStep) => void;
    recipientsOnlyShowSelected: boolean;
    selectedGroups: string[];
    selectedUsers: string[];
    setNewUsers: (newUsers: string[]) => void;
    setSelectedUsers: (selectedUsers: string[]) => void;
    setRecipientsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
    setDoRecipientsOnlyShowSelected: (event: boolean) => void;
    selectedPrivateCollections: string[];
    onDismiss: () => void;
    origin: Origin;
}
export const ShareCollection = ({ step, newUsers, setDoRecipientsOnlyShowSelected, selectedGroups, selectedUsers, selectedPrivateCollections, origin, onDismiss, goToStep, onCheckGroup, onCheckUser, ...rest }: ShareCollectionProps) => {
    const { translate } = useTranslate();
    const { collections, sharedCollections } = useCollectionsContext();
    const alert = useAlert();
    const { createSharedCollection, inviteCollectionMembers } = useModuleCommands(sharingCollectionsApi);
    const retrievedFeatureFlips = useFeatureFlips();
    const [isLoading, setIsLoading] = useState(false);
    const [roles, setRoles] = useState<CollectionSharingRoles[]>([]);
    const [itemPermissions, setItemPermissions] = React.useState(Permission.Limited);
    const { hasSharingCollectionPaywall, canShareCollection, isStarterTeam, isBusinessTrialTeam, isAdmin, } = useCollectionSharingStatus();
    const displaySharingCollectionInformativePaywall = hasSharingCollectionPaywall && isAdmin && canShareCollection;
    const displayAdminSharingCollectionEnforcedPaywall = hasSharingCollectionPaywall && isAdmin && !canShareCollection;
    const displayNonAdminSharingCollectionPaywall = hasSharingCollectionPaywall && !isAdmin;
    const isStarterAdmin = isStarterTeam && isAdmin;
    const isEditorManagerRoleEnabled = Boolean(retrievedFeatureFlips.data?.[EDITOR_MANAGER_FEATURE_FLIP_DEV] ||
        retrievedFeatureFlips.data?.[EDITOR_MANAGER_FEATURE_FLIP_PROD]);
    const isItemPermissionsEnabled = Boolean(retrievedFeatureFlips.data?.[ITEM_PERMISSIONS_FEATURE_FLIP_DEV]);
    const eventWrapper = useEventWrapper();
    const compareByRoleId = (item1: string, item2: CollectionSharingRoles) => {
        return item1 === item2.id;
    };
    const combinedRoles = useMemo(() => {
        const filteredUsersRoles = roles.filter((role) => selectedUsers.some((user) => compareByRoleId(user, role)));
        const filteredGroupsRoles = roles.filter((role) => selectedGroups.some((group) => compareByRoleId(group, role)));
        return [...filteredUsersRoles, ...filteredGroupsRoles];
    }, [roles, selectedUsers, selectedGroups]);
    useEffect(() => {
        if (isEditorManagerRoleEnabled) {
            if (!isEqual(combinedRoles, roles)) {
                setRoles(combinedRoles);
            }
        }
    }, [combinedRoles, isEditorManagerRoleEnabled]);
    const mapToUserRecipient = (id: string): SharedCollectionUserRecipient => {
        const foundRole = roles.find((role) => role.id === id);
        return {
            login: id,
            role: foundRole && isEditorManagerRoleEnabled
                ? foundRole.role
                : SharedCollectionRole.Manager,
        };
    };
    const mapToUserGroupRecipient = (id: string): SharedCollectionUserGroupRecipient => {
        const foundRole = roles.find((role) => role.id === id);
        return {
            groupId: id,
            role: foundRole && isEditorManagerRoleEnabled
                ? foundRole.role
                : SharedCollectionRole.Manager,
        };
    };
    const createSharedCollectionHandler = async (privateCollection: ShareableCollection) => {
        const credentialIds = privateCollection.vaultItems
            .filter(({ type }) => type === VaultItemType.Credential)
            .map(({ id }) => id);
        return await createSharedCollection({
            collectionName: privateCollection.name,
            privateCollectionId: privateCollection.id,
            teamId: privateCollection.spaceId,
            users: selectedUsers.map(mapToUserRecipient),
            groups: selectedGroups.map(mapToUserGroupRecipient),
            itemIds: credentialIds,
            defaultItemPermissions: itemPermissions,
        });
    };
    const inviteToCollectionHandler = (sharedCollection: ShareableCollection) => {
        return inviteCollectionMembers({
            collectionId: sharedCollection.id,
            userRecipients: selectedUsers.map(mapToUserRecipient),
            userGroupRecipients: selectedGroups.map(mapToUserGroupRecipient),
        });
    };
    const shareCollection = useCallback(() => {
        const errorHandler = () => {
            setIsLoading(false);
            alert.showAlert(translate(I18N_KEYS.COLLECTION_SHARE_ERROR), AlertSeverity.ERROR);
            logEvent(new UserSharingOutcomeEvent({
                sharingFlowType: SharingFlowType.CollectionSharing,
                isSuccessful: false,
                origin: origin,
            }));
        };
        const shareCollectionHandler = async () => {
            setIsLoading(true);
            const privateCollection = collections.find((collection) => collection.spaceId &&
                selectedPrivateCollections.includes(collection.id));
            const sharedCollection = sharedCollections.find((collection) => selectedPrivateCollections.includes(collection.id));
            let result;
            if (privateCollection) {
                result = await createSharedCollectionHandler(privateCollection);
            }
            else if (sharedCollection) {
                result = await inviteToCollectionHandler(sharedCollection);
            }
            else {
                errorHandler();
                return;
            }
            if (isFailure(result)) {
                errorHandler();
                return;
            }
            setIsLoading(false);
            alert.showAlert(translate(I18N_KEYS.COLLECTION_SHARE_SUCCESS, {
                collectionName: privateCollection?.name ?? sharedCollection?.name,
            }), AlertSeverity.SUCCESS);
            logEvent(new UserSharingOutcomeEvent({
                sharingFlowType: SharingFlowType.CollectionSharing,
                isSuccessful: true,
                origin: origin,
            }));
            if (isItemPermissionsEnabled) {
                goToStep(SharingInviteStep.Success);
            }
            onDismiss();
        };
        eventWrapper.wrap(shareCollectionHandler, errorHandler)();
    }, [
        collections,
        createSharedCollection,
        eventWrapper,
        onDismiss,
        selectedGroups,
        selectedPrivateCollections,
        selectedUsers,
    ]);
    return (<>
      {step === SharingInviteStep.CollectionRecipients ? (displayNonAdminSharingCollectionPaywall ? (<NonAdminSharingCollectionPaywall onDismiss={onDismiss}/>) : displayAdminSharingCollectionEnforcedPaywall ? (<AdminSharingCollectionPaywall newUsers={newUsers} isStarterTeam={isStarterTeam} onCheckGroup={onCheckGroup} onCheckUser={onCheckUser}/>) : (<CollectionRecipientsStep {...rest} selectedGroups={selectedGroups} selectedUsers={selectedUsers} setRoles={setRoles} origin={origin} onDismiss={onDismiss} roles={roles} isLoading={isLoading} selectedPrivateCollections={selectedPrivateCollections} isEditorManagerRoleEnabled={isEditorManagerRoleEnabled} isItemPermissionsEnabled={isItemPermissionsEnabled} itemPermissions={itemPermissions} setRecipientsOnlyShowSelected={(event) => setDoRecipientsOnlyShowSelected(event.currentTarget.checked)} shareCollection={shareCollection} goToStep={goToStep} newUsers={newUsers} onCheckGroup={onCheckGroup} onCheckUser={onCheckUser} isStarterAdmin={isStarterAdmin} infobox={displaySharingCollectionInformativePaywall ? (<CollectionSharingPaywall isStarterTeam={isStarterTeam} canShareCollection={true} actionProps={{ intensity: 'quiet' }} clickOrigin={ClickOrigin.CollectionsSharingStarterLimitCloseToBeReachedModal}/>) : isBusinessTrialTeam ? (<TrialBusinessCollectionSharingInfobox />) : undefined}/>)) : null}

      {step === SharingInviteStep.CollectionItemPermissions ? (<PermissionStep goToStep={() => goToStep(SharingInviteStep.CollectionRecipients)} onClick={shareCollection} isCollectionSharing isLoading={isLoading} permission={itemPermissions} onSelectPermission={setItemPermissions}/>) : null}
    </>);
};
