import { Dialog, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  TITLE: "webapp_account_recovery_approval_title",
  SUBTITLE: "webapp_account_recovery_approval_subtitle",
  CONTINUE: "webapp_account_recovery_approval_continue",
  CLOSE: "_common_dialog_dismiss_button",
};
interface ApprovalRecoveryProps {
  handleDismiss: () => void;
  isAccountRecoveryApproved: boolean;
  handleAccountRecovery: () => void;
}
export const ApprovalRecoveryDialog = ({
  handleDismiss,
  isAccountRecoveryApproved,
  handleAccountRecovery,
}: ApprovalRecoveryProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen={isAccountRecoveryApproved}
      onClose={handleDismiss}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      decorationSlot={
        <ExpressiveIcon
          name="FeedbackSuccessOutlined"
          size="xlarge"
          mood="positive"
        />
      }
      title={translate(I18N_KEYS.TITLE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.CONTINUE),
          onClick: handleAccountRecovery,
        },
      }}
    >
      <Paragraph>{translate(I18N_KEYS.SUBTITLE)}</Paragraph>
    </Dialog>
  );
};
