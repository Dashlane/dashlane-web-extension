import React from 'react';
import { Lee } from 'lee';
import { RecoveryRequestPanel } from 'account-recovery/admin-assisted-recovery/recovery-request-panel/recovery-request-panel';
import { GenericRecoveryErrorDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/generic-recovery-error/generic-recovery-error';
import { AccountRecoveryMarketingContainer } from 'auth/marketing-container/account-recovery/account-recovery';
import { AccountRecoveryStep } from 'account-recovery/admin-assisted-recovery/types';
import styles from '../account-recovery.css';
interface Props {
    lee: Lee;
}
export const RecoveryRequestScreen = ({ lee }: Props) => {
    const [showGenericRecoveryError, setShowGenericRecoveryError] = React.useState(false);
    return (<div className={styles.panelsContainer}>
      <AccountRecoveryMarketingContainer step={AccountRecoveryStep.ACCOUNT_RECOVERY_REQUEST}/>
      <RecoveryRequestPanel dispatchGlobal={lee.dispatchGlobal} setShowGenericRecoveryError={setShowGenericRecoveryError}/>
      <GenericRecoveryErrorDialog isAccountRecoveryError={showGenericRecoveryError} handleGenericRecoveryErrorClose={() => {
            setShowGenericRecoveryError(false);
        }}/>
    </div>);
};
