import { Dialog, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useHistory } from "../../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
export const I18N_KEYS = {
  TITLE: "webapp_account_recovery_rejection_title",
  SUBTITLE: "webapp_account_recovery_rejection_subtitle",
  DISMISS: "webapp_account_recovery_rejection_dismiss",
  TRY_AGAIN: "webapp_account_recovery_rejection_try_again",
  CLOSE: "_common_dialog_dismiss_button",
};
interface RejectedRecoveryProps {
  handleDismiss: () => void;
  isAccountRecoveryRejected: boolean;
}
export const RejectedRecoveryDialog = ({
  handleDismiss,
  isAccountRecoveryRejected,
}: RejectedRecoveryProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const sendNewRequest = () => {
    history.replace(routes.userDeviceRegistration);
  };
  const handleCloseDialog = () => {
    handleDismiss();
  };
  return (
    <Dialog
      isOpen={isAccountRecoveryRejected}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      onClose={handleCloseDialog}
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
          onClick: handleCloseDialog,
        },
        secondary: {
          children: translate(I18N_KEYS.TRY_AGAIN),
          onClick: sendNewRequest,
        },
      }}
    >
      <Paragraph>{translate(I18N_KEYS.SUBTITLE)}</Paragraph>
    </Dialog>
  );
};
