import { DataStatus } from "@dashlane/framework-react";
import { NotificationName } from "@dashlane/communication";
import { Dialog, Paragraph, useToast } from "@dashlane/design-system";
import { useInviteLinkDataGraphene } from "../settings/hooks/use-invite-link";
import { useNotificationInteracted } from "../../libs/carbon/hooks/useNotificationStatus";
import useTranslate from "../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CLOSE: "_common_dialog_dismiss_button",
  DIALOG_TITLE: "team_activation_dialog_title",
  DIALOG_PARAGRAPH: "team_activation_dialog_paragrah",
  NOT_RIGHT_NOW_BUTTON: "team_activation_dialog_notrightnow_button",
  ACTIVATE_BUTTON: "team_activation_dialog_activate_button",
  SUCCESS_TOAST: "team_activation_dialog_notification",
  CANCEL_TOAST: "team_activation_dialog_cancel_notification",
  CLOSE_TOAST: "_common_toast_close_label",
};
interface ActivateInviteLinkDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onInviteLinkActivation?: () => void;
}
export const ActivateInviteLinkDialog = ({
  isOpen,
  onCancel,
  onInviteLinkActivation,
}: ActivateInviteLinkDialogProps) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const inviteLinkData = useInviteLinkDataGraphene();
  const { setAsInteracted: setActivateLinkInteracted } =
    useNotificationInteracted(NotificationName.ActivateInviteLink);
  if (inviteLinkData.status !== DataStatus.Success) {
    return null;
  }
  const handleOnCancel = () => {
    onCancel();
    showToast({
      mood: "brand",
      description: translate(I18N_KEYS.CANCEL_TOAST),
      closeActionLabel: translate(I18N_KEYS.CLOSE_TOAST),
    });
    setActivateLinkInteracted?.();
  };
  const handleOnInviteLinkActivation = async () => {
    await inviteLinkData.sendToggleInviteLink(true);
    if (onInviteLinkActivation) {
      onInviteLinkActivation();
    }
    showToast({
      mood: "brand",
      description: translate(I18N_KEYS.SUCCESS_TOAST),
      closeActionLabel: translate(I18N_KEYS.CLOSE_TOAST),
    });
    void setActivateLinkInteracted?.();
  };
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onCancel}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.ACTIVATE_BUTTON),
          onClick: handleOnInviteLinkActivation,
        },
        secondary: {
          children: translate(I18N_KEYS.NOT_RIGHT_NOW_BUTTON),
          onClick: handleOnCancel,
        },
      }}
    >
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
      </Paragraph>
    </Dialog>
  );
};
