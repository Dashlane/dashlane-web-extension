import React from 'react';
import { useHistory } from 'libs/router';
import { AlertSeverity, colors, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { LOGIN_URL_SEGMENT } from 'app/routes/constants';
interface CancelRecoveryProps {
    showCancelRequestDialog: boolean;
    handleDismiss: () => void;
    handleShowGenericRecoveryError: () => void;
}
const I18N_KEYS = {
    ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_TITLE: 'webapp_account_recovery_request_dialog_title',
    ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_SUBTITLE: 'webapp_account_recovery_request_dialog_subtitle',
    ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_CONFIRM: 'webapp_account_recovery_request_dialog_confirm',
    ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_DISMISS: 'webapp_account_recovery_request_dialog_dismiss',
    ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_ALERT: 'webapp_account_recovery_request_dialog_alert',
    CLOSE: '_common_dialog_dismiss_button'
};
export const CancelRecoveryDialog = ({ showCancelRequestDialog, handleDismiss, handleShowGenericRecoveryError, }: CancelRecoveryProps) => {
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
            alert.showAlert(translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_ALERT), AlertSeverity.SUCCESS);
            history.replace(LOGIN_URL_SEGMENT);
        }
        catch (err) {
            handleGenericServerError();
            return;
        }
    };
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={showCancelRequestDialog} onClose={handleDismiss}>
      <DialogTitle title={translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <DialogFooter intent="danger" primaryButtonTitle={translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_CONFIRM)} primaryButtonOnClick={handleOnConfirmCancelRequest} secondaryButtonTitle={translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_DIALOG_DISMISS)} secondaryButtonOnClick={handleDismiss}/>
    </Dialog>);
};
