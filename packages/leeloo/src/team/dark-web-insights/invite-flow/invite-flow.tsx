import { TeamMemberInfo } from "@dashlane/communication";
import { Lee } from "../../../lee";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { useTeamBillingInformation } from "../../../libs/hooks/use-team-billing-information";
import { getSeatsTaken } from "../../helpers/get-seats-taken";
import { InviteDialogWithResults } from "../../invite-dialog/invite-dialog-with-results";
import { useInviteResultPartialSuccess } from "../../invite-result-dialog";
import { useTeamSpaceContext } from "../../settings/components/TeamSpaceContext";
interface Props {
  lee: Lee;
  isOpen: boolean;
  onClose: () => void;
  prefilledEmails: Set<string>;
  teamMembers: TeamMemberInfo[];
  handleInviteCompleteSuccess: () => void;
}
export const InviteFlow = ({
  lee,
  isOpen,
  onClose,
  prefilledEmails,
  teamMembers,
  handleInviteCompleteSuccess,
}: Props) => {
  const {
    invitePartialSuccessState,
    setInvitePartialSuccessState,
    handleInvitationResultClosed,
  } = useInviteResultPartialSuccess();
  const { teamId } = useTeamSpaceContext();
  const teamTrialStatus = useTeamTrialStatus();
  const teamBillingInformation = useTeamBillingInformation();
  const seatsTaken = getSeatsTaken(teamMembers);
  if (!teamTrialStatus || !teamBillingInformation) {
    return null;
  }
  return (
    <InviteDialogWithResults
      lee={lee}
      teamId={teamId}
      totalSeatCount={teamBillingInformation.seatsNumber}
      numSeatsTaken={seatsTaken}
      excludedInviteMembers={teamMembers
        .filter(({ status }) => status !== "removed")
        .map(({ login }) => login)}
      isFreeTrial={teamTrialStatus.isFreeTrial}
      shouldShowInviteDialog={isOpen}
      handleCloseInviteDialog={onClose}
      handleInvitePartialSuccess={(
        successfullyInvitedMembers,
        refusedMembers
      ) =>
        setInvitePartialSuccessState({
          show: true,
          invitedMembers: successfullyInvitedMembers,
          refusedMembers: refusedMembers,
        })
      }
      handleInviteCompleteSuccess={handleInviteCompleteSuccess}
      invitePartialSuccessState={invitePartialSuccessState}
      handleInvitationResultClosed={handleInvitationResultClosed}
      preFilledInviteEmails={prefilledEmails}
    />
  );
};
