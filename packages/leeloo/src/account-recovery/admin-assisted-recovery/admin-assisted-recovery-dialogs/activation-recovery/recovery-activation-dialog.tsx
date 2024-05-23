import React from 'react';
import { AlertSeverity, colors, Dialog, DialogBody, DialogFooter, DialogTitle, InfoBox, jsx, KeyIcon, Paragraph, } from '@dashlane/ui-components';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { useShouldShowAccountRecoveryActivationDialog } from './use-should-show-account-recovery-activation-dialog';
import { HELPCENTER_ADMIN_ASSISTED_ACCOUNT_RECOVERY_URL } from 'app/routes/constants';
const I18N_KEYS = {
    ACTIVATION_TITLE: 'webapp_account_recovery_activation_dialog_title',
    ACTIVATION_BODY: 'webapp_account_recovery_activation_dialog_body',
    ACTIVATION_INFOBOX_TEXT: 'webapp_account_recovery_activation_dialog_infobox_text',
    ACTIVATION_PRIMARY_BUTTON: 'webapp_account_recovery_activation_dialog_primary_button',
    ACTIVATION_SECONDARY_BUTTON: 'webapp_account_recovery_activation_dialog_secondary_button',
    ACTIVATION_SUCCESS_ALERT_MESSAGE: 'webapp_account_recovery_activation_success_message',
    CLOSE: '_common_dialog_dismiss_button'
};
export const RecoveryActivationDialog = () => {
    const { translate } = useTranslate();
    const [isFetching, setIsFetching] = React.useState(false);
    const alert = useAlert();
    const { showDialog, markDialogAsSeen } = useShouldShowAccountRecoveryActivationDialog();
    const handleClickOnActivateRecovery = async () => {
        setIsFetching(true);
        await carbonConnector.activateAccountRecovery();
        alert.showAlert(translate(I18N_KEYS.ACTIVATION_SUCCESS_ALERT_MESSAGE), AlertSeverity.SUCCESS);
        setIsFetching(false);
        markDialogAsSeen();
    };
    const handleClickOnLearnMore = async () => {
        window.open(HELPCENTER_ADMIN_ASSISTED_ACCOUNT_RECOVERY_URL);
        markDialogAsSeen();
    };
    return (<Dialog isOpen={showDialog} onClose={() => markDialogAsSeen()} closeIconName={translate(I18N_KEYS.CLOSE)}>
      <div style={{ marginBottom: '30px' }}>
        <KeyIcon size={90}/>
      </div>

      <DialogTitle title={translate(I18N_KEYS.ACTIVATION_TITLE)}/>
      <DialogBody>
        <Paragraph sx={{ marginBottom: '15px' }} color={colors.dashGreen01}>
          {translate(I18N_KEYS.ACTIVATION_BODY)}
        </Paragraph>
        <InfoBox severity="subtle" size="small" title={translate(I18N_KEYS.ACTIVATION_INFOBOX_TEXT)}/>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.ACTIVATION_PRIMARY_BUTTON)} primaryButtonOnClick={handleClickOnActivateRecovery} primaryButtonProps={{
            disabled: isFetching,
            id: 'activate-recovery-button',
        }} secondaryButtonTitle={translate(I18N_KEYS.ACTIVATION_SECONDARY_BUTTON)} secondaryButtonOnClick={handleClickOnLearnMore} secondaryButtonProps={{ disabled: isFetching }}/>
    </Dialog>);
};
