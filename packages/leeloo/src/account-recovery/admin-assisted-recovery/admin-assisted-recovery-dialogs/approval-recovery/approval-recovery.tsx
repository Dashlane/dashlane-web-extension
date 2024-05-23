import React from 'react';
import { AllGoodIcon, colors, Dialog, DialogBody, DialogFooter, DialogTitle, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from '../account-recovery-dialogs.css';
export const I18N_KEYS = {
    TITLE: 'webapp_account_recovery_approval_title',
    SUBTITLE: 'webapp_account_recovery_approval_subtitle',
    CONTINUE: 'webapp_account_recovery_approval_continue',
};
interface ApprovalRecoveryProps {
    handleDismiss: () => void;
    isAccountRecoveryApproved: boolean;
    handleAccountRecovery: () => void;
}
export const ApprovalRecoveryDialog = ({ handleDismiss, isAccountRecoveryApproved, handleAccountRecovery, }: ApprovalRecoveryProps) => {
    const { translate } = useTranslate();
    return (<Dialog isOpen={isAccountRecoveryApproved} onClose={handleDismiss} disableEscapeKeyClose disableOutsideClickClose>
      <div className={styles.icon}>
        <AllGoodIcon size={62} color={colors.midGreen00}/>
      </div>
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS.SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={translate(I18N_KEYS.CONTINUE)} primaryButtonOnClick={handleAccountRecovery}/>
    </Dialog>);
};
