import React from 'react';
import { useHistory } from 'libs/router';
import { colors, CrossCircleIcon, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../account-recovery-dialogs.css';
export const I18N_KEYS = {
    TITLE: 'webapp_account_recovery_rejection_title',
    SUBTITLE: 'webapp_account_recovery_rejection_subtitle',
    DISMISS: 'webapp_account_recovery_rejection_dismiss',
    TRY_AGAIN: 'webapp_account_recovery_rejection_try_again',
    CLOSE: '_common_dialog_dismiss_button'
};
interface RejectedRecoveryProps {
    handleDismiss: () => void;
    isAccountRecoveryRejected: boolean;
}
export const RejectedRecoveryDialog = ({ handleDismiss, isAccountRecoveryRejected, }: RejectedRecoveryProps) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const sendNewRequest = () => {
        history.replace(routes.userDeviceRegistration);
    };
    const handleCloseDialog = () => {
        handleDismiss();
    };
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isAccountRecoveryRejected} onClose={handleCloseDialog}>
      <div className={styles.icon}>
        <CrossCircleIcon size={62} color={colors.functionalRed02}/>
      </div>
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS.SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.DISMISS)} primaryButtonOnClick={handleCloseDialog} secondaryButtonTitle={translate(I18N_KEYS.TRY_AGAIN)} secondaryButtonOnClick={sendNewRequest}/>
    </Dialog>);
};
