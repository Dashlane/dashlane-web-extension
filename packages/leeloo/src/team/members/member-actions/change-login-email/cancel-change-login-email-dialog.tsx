import { TeamMemberInfo } from "@dashlane/communication";
import { Dialog, Paragraph, useToast } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  DIALOG_TITLE: "webapp_cancel_change_contact_email_title",
  DIALOG_DESCRIPTION: "webapp_cancel_change_contact_email_description",
  CLOSE_DIALOG_BUTTON_LABEL: "_common_dialog_dismiss_button",
  CONFIRM_BUTTON: "webapp_cancel_change_contact_email_confirm_button",
  CANCEL_BUTTON: "_common_action_go_back",
  TOAST_CONFIRMATION: "webapp_cancel_change_contact_email_confirmation_toast",
};
export const CancelChangeLoginEmail = ({
  closeDialog,
  selectedMembers,
}: {
  closeDialog: () => void;
  selectedMembers: TeamMemberInfo[];
}) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const cancelEmailChange = (selectedMembers: TeamMemberInfo[]) => {
    return selectedMembers;
  };
  const handleCancelEmailChange = () => {
    cancelEmailChange(selectedMembers);
    closeDialog();
    showToast({
      description: translate(I18N_KEYS.TOAST_CONFIRMATION),
    });
  };
  return (
    <Dialog
      isOpen={true}
      onClose={closeDialog}
      title={translate(I18N_KEYS.DIALOG_TITLE)}
      closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG_BUTTON_LABEL)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONFIRM_BUTTON),
          type: "submit",
          onClick: () => handleCancelEmailChange(),
        },
        secondary: {
          children: translate(I18N_KEYS.CANCEL_BUTTON),
          onClick: closeDialog,
        },
      }}
      isDestructive
    >
      <Paragraph>{translate(I18N_KEYS.DIALOG_DESCRIPTION)}</Paragraph>
    </Dialog>
  );
};
