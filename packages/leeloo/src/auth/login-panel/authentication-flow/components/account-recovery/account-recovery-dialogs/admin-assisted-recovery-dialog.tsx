import { useEffect, useState } from "react";
import { ChangeMPFlowPath, RequestStatus } from "@dashlane/communication";
import { DialogContextProvider } from "../../../../../../webapp/dialog";
import { redirect } from "../../../../../../libs/router";
import { carbonConnector } from "../../../../../../libs/carbon/connector";
import { ADMIN_ASSISTED_RECOVERY_URL_SEGMENT } from "../../../../../../app/routes/constants";
import {
  ApprovalRecoveryDialog,
  BeginAccountRecoveryDialog,
  GenericRecoveryErrorDialog,
  PendingAccountRecoveryDialog,
  RejectedRecoveryDialog,
} from "../../../../../../account-recovery/admin-assisted-recovery/admin-assisted-recovery-dialogs";
import { AdminAssistedARStatus } from "../../../types/admin-assisted-account-recovery";
interface Props {
  onClose: () => void;
  masterPassword: string;
  existingARStatus?: AdminAssistedARStatus;
}
export const AdminAssistedRecoveryDialog = ({
  onClose,
  masterPassword,
  existingARStatus,
}: Props) => {
  const [status, setStatus] = useState<AdminAssistedARStatus>(
    existingARStatus ?? { processStatus: "UNSET" }
  );
  useEffect(() => {
    const setRecoveryStatus = async () => {
      const pendingRequestResponse =
        await carbonConnector.isRecoveryRequestPending();
      if (pendingRequestResponse.success && pendingRequestResponse.response) {
        const result = await carbonConnector.checkRecoveryRequestStatus({
          masterPassword,
        });
        if (result.success) {
          setStatus({
            processStatus: "PENDING",
            requestStatus: result.response.status,
          });
        } else {
        }
      }
    };
    if (status.processStatus === "UNSET") {
      setRecoveryStatus();
    }
  }, []);
  const handleAdminAssistedRecovery = async () => {
    if (!masterPassword || masterPassword.length === 0) {
      return;
    }
    const response = await carbonConnector.recoverUserData({
      masterPassword,
    });
    if (response.success) {
      void carbonConnector.changeMasterPassword({
        newPassword: masterPassword,
        flow: ChangeMPFlowPath.ADMIN_ASSISTED_RECOVERY,
      });
      redirect(`${ADMIN_ASSISTED_RECOVERY_URL_SEGMENT}/change-master-password`);
    } else {
      setStatus({
        processStatus: "ERROR",
      });
    }
  };
  const handleShowAdminAssistedRecoveryError = () => {
    setStatus({
      processStatus: "ERROR",
    });
  };
  const handleShowAdminAssistedRecoveryDialog = () => {
    setStatus({
      processStatus: "UNSET",
    });
  };
  const handleDismissAdminAssistedRecoveryDialog = () => {
    handleShowAdminAssistedRecoveryDialog();
    onClose();
  };
  return (
    <>
      <div id="dashlane-dialog" />
      <DialogContextProvider>
        {status.processStatus === "UNSET" && (
          <BeginAccountRecoveryDialog
            showAccountRecoveryDialog={true}
            handleDismiss={handleDismissAdminAssistedRecoveryDialog}
          />
        )}

        {status.processStatus === "ERROR" && (
          <GenericRecoveryErrorDialog
            isAccountRecoveryError={true}
            handleGenericRecoveryErrorClose={
              handleDismissAdminAssistedRecoveryDialog
            }
          />
        )}

        {status.processStatus === "PENDING" && (
          <>
            <PendingAccountRecoveryDialog
              isAccountRecoveryPending={
                status.requestStatus === RequestStatus.PENDING
              }
              shouldSendNewRequest={!masterPassword}
              handleShowAccountRecoveryDialog={
                handleShowAdminAssistedRecoveryDialog
              }
              handleShowGenericRecoveryError={
                handleShowAdminAssistedRecoveryError
              }
              handleDismiss={handleDismissAdminAssistedRecoveryDialog}
            />
            <ApprovalRecoveryDialog
              isAccountRecoveryApproved={
                status.requestStatus === RequestStatus.APPROVED
              }
              handleDismiss={handleDismissAdminAssistedRecoveryDialog}
              handleAccountRecovery={handleAdminAssistedRecovery}
            />
            <RejectedRecoveryDialog
              isAccountRecoveryRejected={
                status.requestStatus === RequestStatus.REFUSED
              }
              handleDismiss={handleDismissAdminAssistedRecoveryDialog}
            />
          </>
        )}
      </DialogContextProvider>
    </>
  );
};
