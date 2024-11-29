import { useEffect, useState } from "react";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { NotificationName } from "@dashlane/communication";
import { AvailableFeatureFlips } from "@dashlane/team-admin-contracts";
import { Lee } from "../../lee";
import { InviteDialog } from "./invite-dialog";
import InviteResultDialog, {
  InvitePartialSuccessState,
} from "../invite-result-dialog";
import { InviteLinkActivationDialog } from "../invite-link-activation-dialog/invite-link-activation-dialog";
import { InviteLinkSharingDialog } from "../invite-link-sharing-dialog/invite-link-sharing-dialog";
import { useInviteLinkData } from "../settings/hooks/useInviteLinkData";
import { useInviteLinkDataGraphene } from "../settings/hooks/use-invite-link";
import { useNotificationInteracted } from "../../libs/carbon/hooks/useNotificationStatus";
import { ActivateInviteLinkDialog } from "../invite-link-activation-dialog/activate-invite-link-dialog";
import { ShareInviteLinkDialog } from "../invite-link-sharing-dialog/share-invite-link-dialog";
interface Props {
  lee: Lee;
  teamId: number | null;
  isFreeTrial: boolean;
  totalSeatCount: number;
  numSeatsTaken: number;
  excludedInviteMembers?: string[];
  shouldShowInviteDialog: boolean;
  handleCloseInviteDialog: () => void;
  handleInvitePartialSuccess: (
    successfullyInvitedMembers: InvitePartialSuccessState["invitedMembers"],
    refusedMembers: InvitePartialSuccessState["refusedMembers"]
  ) => void;
  handleInviteCompleteSuccess: (
    successfullyInvitedMemberEmails: string[]
  ) => void;
  invitePartialSuccessState: InvitePartialSuccessState;
  handleInvitationResultClosed: () => void;
  preFilledInviteEmails?: Set<string>;
}
export const InviteDialogWithResults = ({
  lee,
  teamId,
  isFreeTrial,
  totalSeatCount,
  numSeatsTaken,
  excludedInviteMembers,
  shouldShowInviteDialog,
  handleCloseInviteDialog,
  handleInvitePartialSuccess,
  handleInviteCompleteSuccess,
  invitePartialSuccessState,
  handleInvitationResultClosed,
  preFilledInviteEmails,
}: Props) => {
  const {
    inviteLinkDataForAdmin,
    inviteLinkDataLoading,
    getInviteLinkDataForAdmin,
  } = useInviteLinkData();
  const isInviteLinkGrapheneFF = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const inviteLinkDataGraphene = useInviteLinkDataGraphene();
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showSharingDialog, setShowSharingDialog] = useState(false);
  const { interacted: activateLinkInteracted } = useNotificationInteracted(
    NotificationName.ActivateInviteLink
  );
  useEffect(() => {
    if (isInviteLinkGrapheneFF === false) {
      getInviteLinkDataForAdmin();
    }
  }, [getInviteLinkDataForAdmin, isInviteLinkGrapheneFF]);
  if (isInviteLinkGrapheneFF === null || isInviteLinkGrapheneFF === undefined) {
    return null;
  }
  const teamData =
    inviteLinkDataGraphene.status === DataStatus.Success
      ? inviteLinkDataGraphene
      : undefined;
  const handleInviteSuccess = (successfullyInvitedMemberEmails: string[]) => {
    if (
      isInviteLinkGrapheneFF
        ? teamData?.enabled === true
        : inviteLinkDataForAdmin?.disabled === false
    ) {
      setShowSharingDialog(true);
    }
    handleInviteCompleteSuccess(successfullyInvitedMemberEmails);
  };
  const shouldShowInviteActivationDialog = isInviteLinkGrapheneFF
    ? !activateLinkInteracted &&
      showActivationDialog &&
      !teamData?.teamKey &&
      inviteLinkDataGraphene.status === DataStatus.Success
    : !activateLinkInteracted &&
      showActivationDialog &&
      !inviteLinkDataLoading &&
      !inviteLinkDataForAdmin?.teamKey;
  const handleOnShareInviteLinkDialogClose = () => {
    setShowSharingDialog(false);
  };
  const handleOnActivateInviteLinkDialogCancel = () => {
    setShowActivationDialog(false);
  };
  const handleOnInviteLinkActivation = () => {
    setShowActivationDialog(false);
    setShowSharingDialog(true);
  };
  return (
    <>
      {shouldShowInviteDialog ? (
        <InviteDialog
          lee={lee}
          slotsTotal={totalSeatCount}
          slotsTaken={numSeatsTaken}
          exclude={excludedInviteMembers}
          isFreeTrial={isFreeTrial}
          isOpen={shouldShowInviteDialog}
          closeInviteDialog={handleCloseInviteDialog}
          handleInvitePartialSuccess={handleInvitePartialSuccess}
          handleInviteCompleteSuccess={handleInviteSuccess}
          preFilledEmails={preFilledInviteEmails}
          setShowActivationDialog={setShowActivationDialog}
        />
      ) : null}
      {shouldShowInviteActivationDialog ? (
        isInviteLinkGrapheneFF ? (
          <ActivateInviteLinkDialog
            isOpen={showActivationDialog}
            onCancel={handleOnActivateInviteLinkDialogCancel}
            onInviteLinkActivation={handleOnInviteLinkActivation}
          />
        ) : (
          <InviteLinkActivationDialog
            showActivationDialog={showActivationDialog}
            setShowActivationDialog={setShowActivationDialog}
            setShowSharingDialog={setShowSharingDialog}
          />
        )
      ) : null}
      {showSharingDialog ? (
        isInviteLinkGrapheneFF ? (
          <ShareInviteLinkDialog
            isOpen={showSharingDialog}
            onClose={handleOnShareInviteLinkDialogClose}
          />
        ) : (
          <InviteLinkSharingDialog
            showSharingDialog={showSharingDialog}
            setShowSharingDialog={setShowSharingDialog}
          />
        )
      ) : null}
      {invitePartialSuccessState.show ? (
        <InviteResultDialog
          teamId={teamId}
          isOpen={invitePartialSuccessState.show}
          onClose={handleInvitationResultClosed}
          invitedMembers={invitePartialSuccessState.invitedMembers}
          refusedMembers={invitePartialSuccessState.refusedMembers}
        />
      ) : null}
    </>
  );
};
