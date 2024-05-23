import * as React from 'react';
import { NotificationName } from '@dashlane/communication';
import { Lee } from 'lee';
import { InviteDialog } from 'team/invite-dialog/invite-dialog';
import InviteResultDialog, { InvitePartialSuccessState, } from 'team/invite-result-dialog';
import { InviteLinkActivationDialog } from 'team/invite-link-activation-dialog/invite-link-activation-dialog';
import { InviteLinkSharingDialog } from 'team/invite-link-sharing-dialog/invite-link-sharing-dialog';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { useNotificationInteracted } from 'libs/carbon/hooks/useNotificationStatus';
interface Props {
    lee: Lee;
    teamId: number | null;
    isFreeTrial: boolean;
    totalSeatCount: number;
    numSeatsTaken: number;
    excludedInviteMembers?: string[];
    shouldShowInviteDialog: boolean;
    handleCloseInviteDialog: () => void;
    handleInvitePartialSuccess: (successfullyInvitedMembers: InvitePartialSuccessState['invitedMembers'], refusedMembers: InvitePartialSuccessState['refusedMembers']) => void;
    handleInviteCompleteSuccess: (successfullyInvitedMemberEmails: string[]) => void;
    invitePartialSuccessState: InvitePartialSuccessState;
    handleInvitationResultClosed: () => void;
    preFilledInviteEmails?: Set<string>;
}
export const InviteDialogWithResults = ({ lee, teamId, isFreeTrial, totalSeatCount, numSeatsTaken, excludedInviteMembers, shouldShowInviteDialog, handleCloseInviteDialog, handleInvitePartialSuccess, handleInviteCompleteSuccess, invitePartialSuccessState, handleInvitationResultClosed, preFilledInviteEmails, }: Props) => {
    const { inviteLinkDataForAdmin, inviteLinkDataLoading, getInviteLinkDataForAdmin, } = useInviteLinkData();
    const [showActivationDialog, setShowActivationDialog] = React.useState(false);
    const [showSharingDialog, setShowSharingDialog] = React.useState(false);
    const { interacted: activateLinkInteracted } = useNotificationInteracted(NotificationName.ActivateInviteLink);
    React.useEffect(() => {
        getInviteLinkDataForAdmin();
    }, [getInviteLinkDataForAdmin]);
    const handleInviteSuccess = (successfullyInvitedMemberEmails: string[]) => {
        if (inviteLinkDataForAdmin?.disabled === false) {
            setShowSharingDialog(true);
        }
        handleInviteCompleteSuccess(successfullyInvitedMemberEmails);
    };
    return (<>
      {shouldShowInviteDialog ? (<InviteDialog lee={lee} slotsTotal={totalSeatCount} slotsTaken={numSeatsTaken} exclude={excludedInviteMembers} isFreeTrial={isFreeTrial} isOpen={shouldShowInviteDialog} closeInviteDialog={handleCloseInviteDialog} handleInvitePartialSuccess={handleInvitePartialSuccess} handleInviteCompleteSuccess={handleInviteSuccess} preFilledEmails={preFilledInviteEmails} setShowActivationDialog={setShowActivationDialog}/>) : null}
      {!activateLinkInteracted &&
            showActivationDialog &&
            !inviteLinkDataLoading &&
            !inviteLinkDataForAdmin?.teamKey ? (<InviteLinkActivationDialog showActivationDialog={showActivationDialog} setShowActivationDialog={setShowActivationDialog} setShowSharingDialog={setShowSharingDialog}/>) : null}
      {showSharingDialog ? (<InviteLinkSharingDialog showSharingDialog={showSharingDialog} setShowSharingDialog={setShowSharingDialog}/>) : null}
      {invitePartialSuccessState.show ? (<InviteResultDialog teamId={teamId} isOpen={invitePartialSuccessState.show} onClose={handleInvitationResultClosed} invitedMembers={invitePartialSuccessState.invitedMembers} refusedMembers={invitePartialSuccessState.refusedMembers}/>) : null}
    </>);
};
