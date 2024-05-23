import { DataStatus } from '@dashlane/carbon-api-consumers';
import { IndeterminateLoader, jsx } from '@dashlane/design-system';
import { useCapabilities } from 'libs/carbon/hooks/useCapabilities';
import { useUserLoginStatus } from 'libs/carbon/hooks/useUserLoginStatus';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { useSharingUsers } from 'webapp/sharing-center/sharing-users/useSharingUsers';
import { useAreProtectedItemsUnlocked } from 'webapp/unlock-items/hooks/use-are-protected-items-unlocked';
import { useSharingTeamLogins } from '../hooks/useSharingTeamLogins';
import { SharingInviteStep } from '../types';
import { SharingRecipientsDialog } from './sharing-recipients-dialog';
const I18N_KEYS = {
    ADD_ITEMS: 'webapp_sharing_invite_add_more_items',
    ITEM_QUERY_ERROR: 'webapp_sharing_invite_item_query_error',
    NEXT: 'webapp_sharing_invite_next',
    SELECT_TITLE: 'webapp_sharing_invite_select_recipients_title',
};
export interface SharingItemsRecipientsStepProps {
    goToStep: (step: SharingInviteStep) => void;
    newUsers: string[];
    onCheckGroup: (groupId: string, checked: boolean) => void;
    onCheckUser: (userId: string, checked: boolean) => void;
    protectedItemsSelected: boolean;
    recipientsOnlyShowSelected: boolean;
    selectedGroups: string[];
    selectedUsers: string[];
    setNewUsers: (newUsers: string[]) => void;
    setSelectedUsers: (selectedUsers: string[]) => void;
    setRecipientsOnlyShowSelected: React.ChangeEventHandler<HTMLInputElement>;
}
export const SharingItemsRecipientsStep = ({ goToStep, protectedItemsSelected, selectedGroups, selectedUsers, ...rest }: SharingItemsRecipientsStepProps) => {
    const { currentSpaceId } = useTeamSpaceContext();
    const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
    const capabilityResult = useCapabilities(['internalSharingOnly']);
    const currentUserLogin = useUserLoginStatus()?.login;
    const userRequest = useSharingUsers('descend', currentSpaceId);
    const teamLogins = useSharingTeamLogins();
    if (userRequest.status !== DataStatus.Success ||
        capabilityResult.status !== DataStatus.Success ||
        teamLogins.status !== DataStatus.Success) {
        return <IndeterminateLoader color="ds.text.brand.standard"/>;
    }
    const isSharingRestrictedToTeam = capabilityResult.data;
    const users = isSharingRestrictedToTeam
        ? teamLogins.data?.userLogins
            .filter((login) => login !== currentUserLogin)
            .map((teamLogin) => ({
            id: teamLogin,
            itemCount: 0,
        }))
        : userRequest.data?.items;
    const hasSelection = selectedGroups.length > 0 || selectedUsers.length > 0;
    const handleNextButtonClicked = () => goToStep(protectedItemsSelected && !areProtectedItemsUnlocked
        ? SharingInviteStep.UnlockProtectedItems
        : SharingInviteStep.Permission);
    const dialogPrimaryAction = {
        onClick: handleNextButtonClicked,
        children: I18N_KEYS.NEXT,
        props: {
            disabled: !hasSelection,
        },
    };
    const dialogSecondaryAction = {
        onClick: () => goToStep(SharingInviteStep.Elements),
        children: I18N_KEYS.ADD_ITEMS,
    };
    return (<SharingRecipientsDialog headingTitle={I18N_KEYS.SELECT_TITLE} emailQueryErrorKey={I18N_KEYS.ITEM_QUERY_ERROR} dialogPrimaryAction={dialogPrimaryAction} dialogSecondaryAction={dialogSecondaryAction} selectedGroups={selectedGroups} selectedUsers={selectedUsers} users={users} allowNewContacts={!isSharingRestrictedToTeam} {...rest}/>);
};
