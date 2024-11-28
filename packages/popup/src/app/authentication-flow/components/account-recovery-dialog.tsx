import React from "react";
import { RequestStatus } from "@dashlane/communication";
import { AccountRecoveryRequestApprovedDialog } from "../../accountRecovery/accountRecoveryRequestApprovedDialog";
import { AccountRecoveryRequestPendingDialog } from "../../accountRecovery/accountRecoveryRequestPendingDialog";
import { AccountRecoveryRequestRefusedDialog } from "../../accountRecovery/accountRecoveryRequestRefusedDialog";
import { AccountRecoveryRequestStartDialog } from "../../accountRecovery/accountRecoveryRequestStartDialog";
export enum AccountRecoveryDialogLocalStatus {
  INITIAL = "INITIAL",
  ERROR = "ERROR",
}
export type AccountRecoveryDialogStatus =
  | RequestStatus
  | AccountRecoveryDialogLocalStatus
  | undefined;
interface AccountRecoveryDialogProps {
  accountRecoveryStatus: AccountRecoveryDialogStatus;
  handleDismiss: () => void;
  shouldSendNewRequest: boolean;
  onSendNewRequest: () => void;
  onCancelRequest: () => void;
  handleAccountRecovery: () => void;
}
export const AccountRecoveryDialog = ({
  accountRecoveryStatus,
  handleAccountRecovery,
  handleDismiss,
  onSendNewRequest,
  onCancelRequest,
  shouldSendNewRequest,
}: AccountRecoveryDialogProps) => {
  return accountRecoveryStatus ? (
    <div id="dialog">
      <AccountRecoveryRequestStartDialog
        isVisible={accountRecoveryStatus === "INITIAL"}
        onDismiss={handleDismiss}
        onStartAccountRecovery={onSendNewRequest}
      />
      <AccountRecoveryRequestPendingDialog
        isVisible={accountRecoveryStatus === RequestStatus.PENDING}
        action={shouldSendNewRequest ? "sendNewRequest" : "cancel"}
        onCancelOrSendNew={
          shouldSendNewRequest ? onSendNewRequest : onCancelRequest
        }
        onDismiss={handleDismiss}
      />
      <AccountRecoveryRequestApprovedDialog
        onRecoverUserAccount={handleAccountRecovery}
        isVisible={accountRecoveryStatus === RequestStatus.APPROVED}
      />
      <AccountRecoveryRequestRefusedDialog
        isVisible={accountRecoveryStatus === RequestStatus.REFUSED}
        onSendNewRequest={onSendNewRequest}
        onDismiss={handleDismiss}
      />
    </div>
  ) : null;
};
