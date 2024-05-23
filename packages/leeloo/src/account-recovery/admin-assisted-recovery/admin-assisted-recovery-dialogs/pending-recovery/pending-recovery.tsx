import React from 'react';
import { ClockOutlinedIcon, colors, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../account-recovery-dialogs.css';
export const I18N_ACCOUNT_RECOVERY_KEYS = {
    PENDING_TITLE: 'webapp_login_form_account_recovery_pending_title',
    PENDING_SUBTITLE: 'webapp_login_form_account_recovery_pending_subtitle',
    PENDING_CONFIRM: 'webapp_login_form_account_recovery_pending_confirm',
    PENDING_CANCEL_REQUEST: 'webapp_login_form_account_recovery_pending_cancel_request',
    PENDING_START_NEW_REQUEST: 'webapp_login_form_account_recovery_pending_start_new',
    CLOSE: '_common_dialog_dismiss_button'
};
interface PendingAccountRecoveryProps {
    isAccountRecoveryPending: boolean;
    shouldSendNewRequest: boolean;
    handleShowGenericRecoveryError: () => void;
    handleShowAccountRecoveryDialog: () => void;
    handleDismiss: () => void;
}
export const PendingAccountRecoveryDialog = ({ isAccountRecoveryPending, shouldSendNewRequest, handleShowGenericRecoveryError, handleShowAccountRecoveryDialog, handleDismiss, }: PendingAccountRecoveryProps) => {
    const { translate } = useTranslate();
    const handleOnConfirmCancelRequest = async () => {
        try {
            const response = await carbonConnector.cancelRecoveryRequest();
            if (!response.success) {
                handleShowGenericRecoveryError();
            }
        }
        catch (err) {
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
    return (<Dialog closeIconName={translate(I18N_ACCOUNT_RECOVERY_KEYS.CLOSE)} isOpen={isAccountRecoveryPending} onClose={() => {
            handleDismiss();
        }}>
      <div className={styles.icon}>
        <ClockOutlinedIcon size={62} color={colors.grey04}/>
      </div>
      <DialogTitle title={translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_ACCOUNT_RECOVERY_KEYS.PENDING_CONFIRM)} primaryButtonOnClick={() => {
            handleDismiss();
        }} secondaryButtonTitle={secondaryButtonTitle} secondaryButtonOnClick={secondaryButtonOnClickHandler}/>
    </Dialog>);
};
