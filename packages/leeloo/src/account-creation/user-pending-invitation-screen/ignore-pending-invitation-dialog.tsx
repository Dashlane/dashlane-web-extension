import { Dialog, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
interface IgnorePendingInvitationDialogProps {
  cancelClick: () => void;
  isOpen: boolean;
  onClose: () => void;
  primaryActionClick: () => void;
}
const I18N_KEYS = {
  IGNORE_PENDING_INVITATION_DIALOG_TITLE:
    "webapp_ignore_pending_invitation_dialog_title",
  IGNORE_PENDING_INVITATION_DIALOG_BODY:
    "webapp_ignore_pending_invitation_dialog_body",
  IGNORE_PENDING_INVITATION_DIALOG_CLOSE_LABEL:
    "webapp_ignore_pending_invitation_dialog_close_label",
  IGNORE_PENDING_INVITATION_DIALOG_PRIMARY_BUTTON:
    "webapp_ignore_pending_invitation_dialog_primary_button",
  IGNORE_PENDING_INVITATION_DIALOG_SECONDARY_BUTTON:
    "webapp_ignore_pending_invitation_dialog_secondary_button",
};
export const IgnorePendingInvitationDialog = ({
  cancelClick,
  isOpen,
  onClose,
  primaryActionClick,
}: IgnorePendingInvitationDialogProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      actions={{
        primary: {
          children: translate(
            I18N_KEYS.IGNORE_PENDING_INVITATION_DIALOG_PRIMARY_BUTTON
          ),
          onClick: primaryActionClick,
        },
        secondary: {
          children: translate(
            I18N_KEYS.IGNORE_PENDING_INVITATION_DIALOG_SECONDARY_BUTTON
          ),
          onClick: cancelClick,
        },
      }}
      isOpen={isOpen}
      closeActionLabel={translate(
        I18N_KEYS.IGNORE_PENDING_INVITATION_DIALOG_CLOSE_LABEL
      )}
      onClose={onClose}
      title={translate(I18N_KEYS.IGNORE_PENDING_INVITATION_DIALOG_TITLE)}
    >
      <Paragraph
        color="ds.text.neutral.quiet"
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.IGNORE_PENDING_INVITATION_DIALOG_BODY)}
      </Paragraph>
    </Dialog>
  );
};
