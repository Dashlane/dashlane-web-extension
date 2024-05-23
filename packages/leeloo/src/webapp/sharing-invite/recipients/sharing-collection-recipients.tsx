import { jsx } from '@dashlane/design-system';
import { Permission, SharedCollectionRole } from '@dashlane/sharing-contracts';
import { Origin } from '@dashlane/hermes';
import { useUserLoginStatus } from 'libs/carbon/hooks/useUserLoginStatus';
import { useSharingTeamLoginsData } from '../hooks/useSharingTeamLogins';
import { SharingRecipientsDialog } from './sharing-recipients-dialog';
import { SharingInviteStep } from '../types';
const I18N_KEYS = {
    COLLECTION_RECIPIENTS_TITLE: 'webapp_sharing_invite_collection_recipients_title',
    COLLECTION_SHARE_SUCCESS: 'webapp_sharing_invite_collection_share_success_message',
    COLLECTION_SHARE_ERROR: 'webapp_sharing_invite_collection_share_error',
    COLLECTION_QUERY_ERROR: 'webapp_sharing_invite_collection_query_error',
    COLLECTION_PERMISSIONS_INFO: 'webapp_sharing_invite_collection_permissions_info',
    COLLECTION_BUTTON_NEXT: 'webapp_sharing_invite_collection_next_button',
    SHARE: '_common_action_share',
};
export interface RecipientsStepProps {
    newUsers: string[];
    onCheckGroup: (groupId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    goToStep: (step: SharingInviteStep) => void;
    shareCollection: () => void;
    recipientsOnlyShowSelected: boolean;
    selectedGroups: string[];
    selectedUsers: string[];
    setNewUsers: (newUsers: string[]) => void;
    setSelectedUsers: (selectedUsers: string[]) => void;
    setRecipientsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
    selectedPrivateCollections: string[];
    onDismiss: () => void;
    itemPermissions: Permission;
    origin: Origin;
    setRoles: (roles: CollectionSharingRoles[]) => void;
    roles: CollectionSharingRoles[];
    isLoading: boolean;
    isEditorManagerRoleEnabled: boolean;
    isItemPermissionsEnabled: boolean;
    infobox?: JSX.Element;
    isStarterAdmin?: boolean;
}
export type CollectionSharingRoles = {
    id: string;
    role: SharedCollectionRole;
};
export const CollectionRecipientsStep = ({ newUsers, selectedGroups, selectedUsers, goToStep, shareCollection, isEditorManagerRoleEnabled, isItemPermissionsEnabled, isLoading, setRoles, roles, infobox, isStarterAdmin, ...rest }: RecipientsStepProps) => {
    const teamLogins = useSharingTeamLoginsData();
    const currentUserLogin = useUserLoginStatus()?.login;
    const users = teamLogins
        .filter((login) => login !== currentUserLogin)
        .map((teamLogin) => ({
        id: teamLogin,
        itemCount: 0,
    }));
    const hasSelection = selectedGroups.length > 0 || selectedUsers.length > 0;
    const dialogPrimaryAction = {
        onClick: isItemPermissionsEnabled
            ? () => goToStep(SharingInviteStep.CollectionItemPermissions)
            : shareCollection,
        children: isItemPermissionsEnabled
            ? I18N_KEYS.COLLECTION_BUTTON_NEXT
            : I18N_KEYS.SHARE,
        props: {
            disabled: !hasSelection ||
                isLoading ||
                (isEditorManagerRoleEnabled && !roles.length),
        },
    };
    return (<SharingRecipientsDialog headingTitle={I18N_KEYS.COLLECTION_RECIPIENTS_TITLE} emailQueryErrorKey={I18N_KEYS.COLLECTION_QUERY_ERROR} collectionPermissionInfoKey={I18N_KEYS.COLLECTION_PERMISSIONS_INFO} isEditorManagerRoleEnabled={isEditorManagerRoleEnabled} dialogPrimaryAction={dialogPrimaryAction} users={users} roles={roles} onRolesChanged={setRoles} selectedGroups={selectedGroups} selectedUsers={selectedUsers} newUsers={newUsers} infobox={infobox} isStarterAdmin={isStarterAdmin} {...rest}/>);
};
