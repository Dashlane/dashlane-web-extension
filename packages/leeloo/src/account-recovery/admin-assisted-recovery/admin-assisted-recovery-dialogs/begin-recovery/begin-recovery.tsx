import React from 'react';
import { useHistory } from 'libs/router';
import { colors, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
export const I18N_ACCOUNT_RECOVERY_KEYS = {
    TITLE: 'webapp_login_form_account_recovery_title',
    SUBTITLE: 'webapp_login_form_account_recovery_subtitle',
    CONFIRM: 'webapp_login_form_account_recovery_confirm',
    DISMISS: 'webapp_login_form_account_recovery_dismiss',
    CLOSE: '_common_dialog_dismiss_button'
};
interface BeginAccountRecoveryProps {
    showAccountRecoveryDialog: boolean;
    handleDismiss: () => void;
}
export const BeginAccountRecoveryDialog = ({ showAccountRecoveryDialog, handleDismiss, }: BeginAccountRecoveryProps) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const handleOnStartAccountRecovery = () => {
        handleDismiss();
        history.push(routes.userDeviceRegistration);
    };
    const onHandleCloseAccountRecoveryDialog = () => {
        handleDismiss();
    };
    return (<Dialog closeIconName={translate(I18N_ACCOUNT_RECOVERY_KEYS.CLOSE)} isOpen={showAccountRecoveryDialog} onClose={onHandleCloseAccountRecoveryDialog}>
      <DialogTitle title={translate(I18N_ACCOUNT_RECOVERY_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_ACCOUNT_RECOVERY_KEYS.SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_ACCOUNT_RECOVERY_KEYS.CONFIRM)} primaryButtonOnClick={handleOnStartAccountRecovery} secondaryButtonTitle={translate(I18N_ACCOUNT_RECOVERY_KEYS.DISMISS)} secondaryButtonOnClick={onHandleCloseAccountRecoveryDialog}/>
    </Dialog>);
};
