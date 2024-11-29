import { NotificationName } from "@dashlane/communication";
import { Dialog, Paragraph, useToast } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { useInviteLinkData } from "../settings/hooks/useInviteLinkData";
import { useNotificationInteracted } from "../../libs/carbon/hooks/useNotificationStatus";
import { useGetTeamName } from "../hooks/use-get-team-name";
const I18N_KEYS = {
  DIALOG_TITLE: "team_activation_dialog_title",
  DIALOG_PARAGRAPH: "team_activation_dialog_paragrah",
  NOT_RIGHT_NOW_BUTTON: "team_activation_dialog_notrightnow_button",
  ACTIVATE_BUTTON: "team_activation_dialog_activate_button",
  SUCCESS_TOAST: "team_activation_dialog_notification",
  CANCEL_TOAST: "team_activation_dialog_cancel_notification",
  CLOSE: "_common_dialog_dismiss_button",
  CLOSE_TOAST: "_common_toast_close_label",
};
interface InviteLinkActivationDialogProps {
  showActivationDialog: boolean;
  setShowActivationDialog: (isActivationDialogOpen: boolean) => void;
  setShowSharingDialog: (isSharingDialogOpen: boolean) => void;
}
export const InviteLinkActivationDialog = ({
  showActivationDialog,
  setShowActivationDialog,
  setShowSharingDialog,
}: InviteLinkActivationDialogProps) => {
  const { toggleInviteLink, createInviteLink, getInviteLinkDataForAdmin } =
    useInviteLinkData();
  const { setAsInteracted: setActivateLinkInteracted } =
    useNotificationInteracted(NotificationName.ActivateInviteLink);
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const teamName = useGetTeamName();
  if (!teamName) {
    return null;
  }
  const handleClickOnActivate = async () => {
    setActivateLinkInteracted?.();
    setShowActivationDialog(false);
    const inviteLinkDataForAdmin = await getInviteLinkDataForAdmin();
    if (!inviteLinkDataForAdmin?.teamKey) {
      await createInviteLink(teamName);
      showToast({
        description: translate(I18N_KEYS.SUCCESS_TOAST),
        mood: "brand",
        closeActionLabel: translate(I18N_KEYS.CLOSE_TOAST),
      });
    } else {
      await toggleInviteLink(false);
    }
    setShowSharingDialog(true);
  };
  const handleClickOnNotNow = () => {
    setActivateLinkInteracted?.();
    setShowActivationDialog(false);
    showToast({
      description: translate(I18N_KEYS.CANCEL_TOAST),
      mood: "brand",
      closeActionLabel: translate(I18N_KEYS.CLOSE_TOAST),
    });
  };
  return (
    <Dialog
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      isOpen={showActivationDialog}
      onClose={() => setShowActivationDialog(false)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.ACTIVATE_BUTTON),
          onClick: handleClickOnActivate,
        },
        secondary: {
          children: translate(I18N_KEYS.NOT_RIGHT_NOW_BUTTON),
          onClick: handleClickOnNotNow,
        },
      }}
    >
      <Paragraph sx={{ marginBottom: "15px" }}>
        {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
      </Paragraph>
    </Dialog>
  );
};
