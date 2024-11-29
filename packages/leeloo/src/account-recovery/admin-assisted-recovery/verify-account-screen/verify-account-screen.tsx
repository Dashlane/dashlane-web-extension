import React from "react";
import { Lee } from "../../../lee";
import { VerifyAccountPanel } from "../verify-account-panel/verify-account-panel";
import { GenericRecoveryErrorDialog } from "../admin-assisted-recovery-dialogs/generic-recovery-error/generic-recovery-error";
import { AccountRecoveryMarketingContainer } from "../../../left-panels";
import styles from "../account-recovery.css";
import { AccountRecoveryStep } from "../types";
interface Props {
  lee: Lee;
}
export const VerifyAccountScreen = ({ lee }: Props) => {
  const [showGenericRecoveryError, setShowGenericRecoveryError] =
    React.useState(false);
  return (
    <div className={styles.panelsContainer}>
      <AccountRecoveryMarketingContainer
        step={AccountRecoveryStep.VERIFY_ACCOUNT}
      />
      <VerifyAccountPanel
        dispatchGlobal={lee.dispatchGlobal}
        setShowGenericRecoveryError={setShowGenericRecoveryError}
      />
      <GenericRecoveryErrorDialog
        isAccountRecoveryError={showGenericRecoveryError}
        handleGenericRecoveryErrorClose={() => {
          setShowGenericRecoveryError(false);
        }}
      />
    </div>
  );
};
