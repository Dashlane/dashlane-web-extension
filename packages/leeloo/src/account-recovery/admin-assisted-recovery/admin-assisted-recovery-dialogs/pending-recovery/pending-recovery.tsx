import { Dialog, ExpressiveIcon, Paragraph } from "@dashlane/design-system";
import { carbonConnector } from "../../../../libs/carbon/connector";
import useTranslate from "../../../../libs/i18n/useTranslate";
export const I18N_ACCOUNT_RECOVERY_KEYS = {
  PENDING_TITLE: "webapp_login_form_account_recovery_pending_title",
  PENDING_SUBTITLE: "webapp_login_form_account_recovery_pending_subtitle",
  PENDING_CONFIRM: "webapp_login_form_account_recovery_pending_confirm",
  PENDING_CANCEL_REQUEST:
    "webapp_login_form_account_recovery_pending_cancel_request",
  PENDING_START_NEW_REQUEST:
    "webapp_login_form_account_recovery_pending_start_new",
  CLOSE: "_common_dialog_dismiss_button",
};
interface PendingAccountRecoveryProps {
  isAccountRecoveryPending: boolean;
  shouldSendNewRequest: boolean;
  handleShowGenericRecoveryError: () => void;
  handleShowAccountRecoveryDialog: () => void;
  handleDismiss: () => void;
}
export const PendingAccountRecoveryDialog = ({
  isAccountRecoveryPending,
  shouldSendNewRequest,
  handleShowGenericRecoveryError,
  handleShowAccountRecoveryDialog,
  handleDismiss,
}: PendingAccountRecoveryProps) => {
  const { translate } = useTranslate();
  const handleOnConfirmCancelRequest = async () => {
    try {
      const response = await carbonConnector.cancelRecoveryRequest();
      if (!response.success) {
        handleShowGenericRecoveryError();
      }
    } catch (err) {
      handleShowGenericRecoveryError();
    }
    handleDismiss();
  };
  const secondaryButtonTitle = shouldSendNewRequest
    ? translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_START_NEW_REQUEST)
    : translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_CANCEL_REQUEST);
  const secondaryButtonOnClickHandler = shouldSendNewRequest
    ? handleShowAccountRecoveryDialog
    : handleOnConfirmCancelRequest;
  return (
    <Dialog
      isOpen={isAccountRecoveryPending}
      closeActionLabel={translate(I18N_ACCOUNT_RECOVERY_KEYS.CLOSE)}
      onClose={() => {
        handleDismiss();
      }}
      decorationSlot={
        <ExpressiveIcon name="TimeOutlined" size="xlarge" mood="brand" />
      }
      title={translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_TITLE)}
      actions={{
        primary: {
          children: translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_CONFIRM),
          onClick: handleDismiss,
        },
        secondary: {
          children: secondaryButtonTitle,
          onClick: secondaryButtonOnClickHandler,
        },
      }}
    >
      <Paragraph>
        {translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_SUBTITLE)}
      </Paragraph>
    </Dialog>
  );
};
