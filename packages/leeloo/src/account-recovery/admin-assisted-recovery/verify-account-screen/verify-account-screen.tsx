import React from 'react';
import { Lee } from 'lee';
import { VerifyAccountPanel } from 'account-recovery/admin-assisted-recovery/verify-account-panel/verify-account-panel';
import { GenericRecoveryErrorDialog } from 'account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs/generic-recovery-error/generic-recovery-error';
import { AccountRecoveryMarketingContainer } from 'auth/marketing-container/account-recovery/account-recovery';
import styles from '../account-recovery.css';
import { AccountRecoveryStep } from 'account-recovery/admin-assisted-recovery/types';
interface Props {
    lee: Lee;
}
export const VerifyAccountScreen = ({ lee }: Props) => {
    const [showGenericRecoveryError, setShowGenericRecoveryError] = React.useState(false);
    return (<div className={styles.panelsContainer}>
      <AccountRecoveryMarketingContainer step={AccountRecoveryStep.VERIFY_ACCOUNT}/>
      <VerifyAccountPanel dispatchGlobal={lee.dispatchGlobal} setShowGenericRecoveryError={setShowGenericRecoveryError}/>
      <GenericRecoveryErrorDialog isAccountRecoveryError={showGenericRecoveryError} handleGenericRecoveryErrorClose={() => {
            setShowGenericRecoveryError(false);
        }}/>
    </div>);
};
