import { useHistory } from "../../../../libs/router";
import { Dialog, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import { AlertSeverity } from "@dashlane/ui-components";
import { LOGIN_URL_SEGMENT } from "../../../../app/routes/constants";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import { carbonConnector } from "../../../../libs/carbon/connector";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface CancelRecoveryProps {
  showCancelRequestDialog: boolean;
  handleDismiss: () => void;
  handleShowGenericRecoveryError: () => void;
}
const I18N_KEYS = {
  ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_TITLE:
    "webapp_account_recovery_request_dialog_title",
  ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_SUBTITLE:
    "webapp_account_recovery_request_dialog_subtitle",
  ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_CONFIRM:
    "webapp_account_recovery_request_dialog_confirm",
  ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_DISMISS:
    "webapp_account_recovery_request_dialog_dismiss",
  ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_ALERT:
    "webapp_account_recovery_request_dialog_alert",
  CLOSE: "_common_dialog_dismiss_button",
};
export const CancelRecoveryDialog = ({
  showCancelRequestDialog,
  handleDismiss,
  handleShowGenericRecoveryError,
}: CancelRecoveryProps) => {
  const { translate } = useTranslate();
  const history = useHistory();
  const alert = useAlert();
  const handleGenericServerError = () => {
    handleDismiss();
    handleShowGenericRecoveryError();
  };
  const handleOnConfirmCancelRequest = async () => {
    try {
      const response = await carbonConnector.cancelRecoveryRequest();
      if (!response.success) {
        handleGenericServerError();
        return;
      }
      alert.showAlert(
        translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_ALERT),
        AlertSeverity.SUCCESS
      );
      history.replace(LOGIN_URL_SEGMENT);
    } catch (err) {
      handleGenericServerError();
      return;
    }
  };
  return (
    <Dialog
      isOpen={showCancelRequestDialog}
      onClose={handleDismiss}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      decorationSlot={
        <ExpressiveIcon name="RecoveryKeyOutlined" size="xlarge" mood="brand" />
      }
      title={translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_TITLE)}
      actions={{
        primary: {
          children: translate(
            I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_CONFIRM
          ),
          onClick: handleOnConfirmCancelRequest,
        },
        secondary: {
          children: translate(
            I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_DISMISS
          ),
          onClick: handleDismiss,
        },
      }}
    >
      <Paragraph>
        {translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_SUBTITLE)}
      </Paragraph>
    </Dialog>
  );
};
