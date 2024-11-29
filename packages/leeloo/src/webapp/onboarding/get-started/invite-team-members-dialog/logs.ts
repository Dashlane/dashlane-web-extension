import { FlowStep, UserSendManualInviteEvent } from "@dashlane/hermes";
import { logEvent } from "../../../../libs/logs/logEvent";
const logStartSendManualInvite = () => {
  void logEvent(
    new UserSendManualInviteEvent({
      flowStep: FlowStep.Start,
      isImport: false,
      isResend: false,
      inviteCount: 0,
      inviteFailedCount: 0,
      inviteResentCount: 0,
      inviteSuccessfulCount: 0,
    })
  );
};
const logCancelSendManualInvite = () => {
  void logEvent(
    new UserSendManualInviteEvent({
      flowStep: FlowStep.Cancel,
      isImport: false,
      isResend: false,
      inviteCount: 0,
      inviteFailedCount: 0,
      inviteResentCount: 0,
      inviteSuccessfulCount: 0,
    })
  );
};
const logCompleteSendManualInvite = (
  inviteCount: number,
  inviteSuccessfulCount: number
) => {
  void logEvent(
    new UserSendManualInviteEvent({
      flowStep: FlowStep.Complete,
      isImport: false,
      isResend: false,
      inviteCount,
      inviteFailedCount: 0,
      inviteResentCount: 0,
      inviteSuccessfulCount,
    })
  );
};
const logErrorSendManualInvite = (
  inviteCount: number,
  inviteSuccessfulCount: number,
  inviteFailedCount: number
) => {
  void logEvent(
    new UserSendManualInviteEvent({
      flowStep: FlowStep.Error,
      isImport: false,
      isResend: false,
      inviteCount,
      inviteFailedCount,
      inviteResentCount: 0,
      inviteSuccessfulCount,
    })
  );
};
export {
  logErrorSendManualInvite,
  logCompleteSendManualInvite,
  logCancelSendManualInvite,
  logStartSendManualInvite,
};
