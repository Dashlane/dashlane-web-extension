import { Dialog, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  TITLE: "webapp_account_recovery_generic_error_title",
  SUBTITLE: "webapp_account_recovery_generic_error_subtitle",
  DISMISS: "webapp_account_recovery_generic_error_dismiss",
  CLOSE: "_common_dialog_dismiss_button",
};
interface GenericRecoveryErrorProps {
  isAccountRecoveryError: boolean;
  handleGenericRecoveryErrorClose: () => void;
}
export const GenericRecoveryErrorDialog = ({
  isAccountRecoveryError,
  handleGenericRecoveryErrorClose,
}: GenericRecoveryErrorProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen={isAccountRecoveryError}
      onClose={handleGenericRecoveryErrorClose}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      decorationSlot={
        <ExpressiveIcon
          name="FeedbackFailOutlined"
          size="xlarge"
          mood="danger"
        />
      }
      title={translate(I18N_KEYS.TITLE)}
      actions={{
        primary: {
          children: translate(I18N_KEYS.DISMISS),
          onClick: handleGenericRecoveryErrorClose,
        },
      }}
    >
      <Paragraph>{translate(I18N_KEYS.SUBTITLE)}</Paragraph>
    </Dialog>
  );
};
