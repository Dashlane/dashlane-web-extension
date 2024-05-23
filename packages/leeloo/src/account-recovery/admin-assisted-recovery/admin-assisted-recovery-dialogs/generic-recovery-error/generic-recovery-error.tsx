import React from 'react';
import { colors, CrossCircleIcon, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../account-recovery-dialogs.css';
export const I18N_KEYS = {
    TITLE: 'webapp_account_recovery_generic_error_title',
    SUBTITLE: 'webapp_account_recovery_generic_error_subtitle',
    DISMISS: 'webapp_account_recovery_generic_error_dismiss',
    CLOSE: '_common_dialog_dismiss_button'
};
interface GenericRecoveryErrorProps {
    isAccountRecoveryError: boolean;
    handleGenericRecoveryErrorClose: () => void;
}
export const GenericRecoveryErrorDialog = ({ isAccountRecoveryError, handleGenericRecoveryErrorClose, }: GenericRecoveryErrorProps) => {
    const { translate } = useTranslate();
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isAccountRecoveryError} onClose={handleGenericRecoveryErrorClose}>
      <div className={styles.icon}>
        <CrossCircleIcon size={62} color={colors.functionalRed02}/>
      </div>
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS.SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.DISMISS)} primaryButtonOnClick={handleGenericRecoveryErrorClose}/>
    </Dialog>);
};
