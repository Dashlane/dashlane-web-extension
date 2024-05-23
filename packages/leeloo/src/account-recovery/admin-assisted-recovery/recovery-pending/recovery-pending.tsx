import * as React from 'react';
import { Button, FlexChild, FlexContainer, Lockup, LockupColor, LockupSize, } from '@dashlane/ui-components';
import laptop from 'account-recovery/admin-assisted-recovery/recovery-pending/images/laptop.svg';
import styles from './recovery-pending.css';
import useTranslate from 'libs/i18n/useTranslate';
import { CancelRecoveryDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/cancel-recovery/cancel-recovery';
import { GenericRecoveryErrorDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/generic-recovery-error/generic-recovery-error';
const I18N_KEYS = {
    ACCOUNT_RECOVERY_REQUEST_SENT_HEADER: 'webapp_account_recovery_request_sent_header',
    ACCOUNT_RECOVERY_REQUEST_SENT_RECIEVE_EMAIL: 'webapp_account_recovery_request_sent_recieve_email',
    ACCOUNT_RECOVERY_REQUEST_SENT_CONTACT_ADMIN: 'webapp_account_recovery_request_sent_contact_admin',
    ACCOUNT_RECOVERY_SEND_REQUEST_LABEL: 'webapp_account_recovery_request_sent_label',
    LOGO_TITLE: '_common_dashlane_logo_title',
    LAPTOP_ALT_TAG: 'webapp_account_recovery_request_laptop_alt_tag'
};
export const AccountRecoveryPending = () => {
    const { translate } = useTranslate();
    const [showCancelRequestDialog, setShowCancelRequestDialog] = React.useState(false);
    const [showGenericRecoveryError, setShowGenericRecoveryError] = React.useState(false);
    return (<>
      <FlexContainer className={styles.standardHeader} alignItems="center" justifyContent="space-between">
        <FlexChild>
          <Lockup color={LockupColor.DashGreen} size={LockupSize.Size39} title={translate(I18N_KEYS.LOGO_TITLE)}/>
        </FlexChild>
      </FlexContainer>
      <FlexContainer className={styles.accountRecoveryContent} alignItems="center" flexDirection="column">
        <img src={laptop} alt={translate(I18N_KEYS.LAPTOP_ALT_TAG)}/>
        <h1 className={styles.heading}>
          {translate(I18N_KEYS.ACCOUNT_RECOVERY_REQUEST_SENT_HEADER)}
        </h1>
        <p className={styles.subheading}>
          {translate(I18N_KEYS.ACCOUNT_RECOVERY_REQUEST_SENT_RECIEVE_EMAIL)}
        </p>
        <p className={styles.subheading}>
          {translate(I18N_KEYS.ACCOUNT_RECOVERY_REQUEST_SENT_CONTACT_ADMIN)}
        </p>
        <Button className={styles.cancelRequestButton} nature="secondary" type="button" onClick={() => {
            setShowCancelRequestDialog(true);
        }}>
          {translate(I18N_KEYS.ACCOUNT_RECOVERY_SEND_REQUEST_LABEL)}
        </Button>
        <CancelRecoveryDialog showCancelRequestDialog={showCancelRequestDialog} handleDismiss={() => {
            setShowCancelRequestDialog(false);
        }} handleShowGenericRecoveryError={() => {
            setShowGenericRecoveryError(true);
        }}/>
        <GenericRecoveryErrorDialog isAccountRecoveryError={showGenericRecoveryError} handleGenericRecoveryErrorClose={() => {
            setShowGenericRecoveryError(false);
        }}/>
      </FlexContainer>
    </>);
};
