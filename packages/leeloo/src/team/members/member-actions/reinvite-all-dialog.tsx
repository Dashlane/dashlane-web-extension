import { useEffect, useState } from "react";
import { Dialog, Paragraph, useToast } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { AvailableFeatureFlips } from "@dashlane/team-admin-contracts";
import { getInviteLinkWithTeamKey } from "../../urls";
import { useInviteLinkData } from "../../settings/hooks/useInviteLinkData";
import { useInviteLinkDataGraphene } from "../../settings/hooks/use-invite-link";
const I18N_KEYS = {
  REINVITE_ALL_TITLE: "team_members_reinvite_dialog_title",
  REINVITE_ALL_MSG: "team_members_resend_invite_dialog_message",
  REINVITE_ALL_MSG_CONFIRM_BTN:
    "team_members_resend_invite_dialog_resend_confirm",
  COPY_INVITE_LINK_BUTTON: "team_members_resend_copy_invite_link",
  INVITE_LINK_DESCRIPTION: "team_members_resend_invite_link_description",
  SHARELINK_COPIED: "team_members_share_invite_link_copied",
};
export const ReinviteAllDialog = ({
  closeDialog,
  resendOrReactivate,
}: {
  closeDialog: () => void;
  resendOrReactivate: () => Promise<void>;
}) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const [isSendingInvites, setIsSendingInvites] = useState<boolean>(false);
  const isInviteLinkGrapheneFF = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const inviteLinkDataGraphene = useInviteLinkDataGraphene();
  const teamData =
    inviteLinkDataGraphene.status === DataStatus.Success
      ? inviteLinkDataGraphene
      : undefined;
  const { getInviteLinkDataForAdmin, inviteLinkDataForAdmin } =
    useInviteLinkData();
  const teamSignUpPageActive = isInviteLinkGrapheneFF
    ? teamData?.enabled === true
    : inviteLinkDataForAdmin?.disabled === false;
  const inviteLink = getInviteLinkWithTeamKey(
    isInviteLinkGrapheneFF ? teamData?.teamKey : inviteLinkDataForAdmin?.teamKey
  );
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    showToast({
      description: translate(I18N_KEYS.SHARELINK_COPIED),
      mood: "brand",
    });
  };
  useEffect(() => {
    if (isInviteLinkGrapheneFF === false) {
      getInviteLinkDataForAdmin();
    }
  }, [getInviteLinkDataForAdmin, isInviteLinkGrapheneFF]);
  return (
    <Dialog
      title={translate(I18N_KEYS.REINVITE_ALL_TITLE)}
      isOpen={true}
      onClose={closeDialog}
      closeActionLabel="Closing dialog"
      actions={{
        primary: {
          isLoading: isSendingInvites,
          disabled: isSendingInvites,
          children: translate(I18N_KEYS.REINVITE_ALL_MSG_CONFIRM_BTN),
          onClick: async () => {
            setIsSendingInvites(true);
            await resendOrReactivate();
            setIsSendingInvites(false);
            closeDialog();
          },
        },
        secondary: teamSignUpPageActive
          ? {
              children: translate(I18N_KEYS.COPY_INVITE_LINK_BUTTON),
              onClick: handleCopyInviteLink,
            }
          : undefined,
      }}
    >
      <Paragraph>{translate(I18N_KEYS.REINVITE_ALL_MSG)}</Paragraph>
      {teamSignUpPageActive ? (
        <>
          <Paragraph textStyle="ds.body.standard.regular">
            {translate(I18N_KEYS.INVITE_LINK_DESCRIPTION)}
          </Paragraph>
          <Paragraph
            textStyle="ds.body.standard.regular"
            sx={{ textDecoration: "underline" }}
          >
            {inviteLink}
          </Paragraph>
        </>
      ) : null}
    </Dialog>
  );
};
