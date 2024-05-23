import { Lee } from 'lee';
import { useEffect, useRef, useState } from 'react';
import { jsx } from '@dashlane/ui-components';
import { TeamMemberInfo } from '@dashlane/communication';
import TeamPlans from 'libs/api/TeamPlans';
import { getAuth as getUserAuth } from 'user';
import { getSeatsTaken } from 'team/helpers/get-seats-taken';
import { InviteDialogWithResults } from 'team/invite-dialog/invite-dialog-with-results';
import { useInviteResultPartialSuccess } from 'team/invite-result-dialog';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
interface Props {
    lee: Lee;
    isOpen: boolean;
    onClose: () => void;
    prefilledEmails: Set<string>;
    teamMembers: TeamMemberInfo[];
    handleInviteCompleteSuccess: () => void;
}
export const InviteFlow = ({ lee, isOpen, onClose, prefilledEmails, teamMembers, handleInviteCompleteSuccess, }: Props) => {
    const unmounted = useRef(false);
    const { invitePartialSuccessState, setInvitePartialSuccessState, handleInvitationResultClosed, } = useInviteResultPartialSuccess();
    const { teamId } = useTeamSpaceContext();
    const seatsTaken = getSeatsTaken(teamMembers);
    const [totalSeatCount, setTotalSeatCount] = useState(0);
    const [isFreeTrial, setIsFreeTrial] = useState(false);
    useEffect(() => {
        const auth = getUserAuth(lee.globalState);
        if (!auth) {
            return;
        }
        new TeamPlans()
            .status({ auth })
            .then((status) => {
            if (!unmounted.current) {
                setTotalSeatCount(status.content.team.membersNumber +
                    status.content.team.extraFreeSlots);
                setIsFreeTrial(status.content.team.isFreeTrial);
            }
        })
            .catch();
        return () => {
            unmounted.current = true;
        };
    }, []);
    return (<InviteDialogWithResults lee={lee} teamId={teamId} totalSeatCount={totalSeatCount} numSeatsTaken={seatsTaken} excludedInviteMembers={teamMembers
            .filter(({ status }) => status !== 'removed')
            .map(({ login }) => login)} isFreeTrial={isFreeTrial} shouldShowInviteDialog={isOpen} handleCloseInviteDialog={onClose} handleInvitePartialSuccess={(successfullyInvitedMembers, refusedMembers) => setInvitePartialSuccessState({
            show: true,
            invitedMembers: successfullyInvitedMembers,
            refusedMembers: refusedMembers,
        })} handleInviteCompleteSuccess={handleInviteCompleteSuccess} invitePartialSuccessState={invitePartialSuccessState} handleInvitationResultClosed={handleInvitationResultClosed} preFilledInviteEmails={prefilledEmails}/>);
};
