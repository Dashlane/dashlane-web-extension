import { defineModuleApi } from "@dashlane/framework-contracts";
import { IdentityVerificationFlowStatusQuery } from "./identity-verification-flow.queries";
import {
  CancelIdentityVerificationCommand,
  ChangeTwoFactorAuthenticationOtpTypeCommand,
  ClearIdentityVerificationErrorCommand,
  ResendEmailTokenCommand,
  ResendPushNotificationCommand,
  StartIdentityVerificationCommand,
  SubmitBackupCodeCommand,
  SubmitEmailTokenCommand,
  SubmitTotpCommand,
  SwitchToDashlaneAuthenticatorCommand,
  SwitchToEmailTokenCommand,
} from "./identity-verification-flow.commands";
import { IdentityVerificationCompletedEvent } from "./identity-verification-flow.events";
export const identityVerificationFlowApi = defineModuleApi({
  name: "identityVerificationFlow" as const,
  commands: {
    changeTwoFactorAuthenticationOtpType:
      ChangeTwoFactorAuthenticationOtpTypeCommand,
    clearError: ClearIdentityVerificationErrorCommand,
    resendEmailToken: ResendEmailTokenCommand,
    resendPushNotification: ResendPushNotificationCommand,
    submitBackupCode: SubmitBackupCodeCommand,
    submitEmailToken: SubmitEmailTokenCommand,
    submitTotp: SubmitTotpCommand,
    switchToDashlaneAuthenticator: SwitchToDashlaneAuthenticatorCommand,
    switchToEmailToken: SwitchToEmailTokenCommand,
    startIdentityVerification: StartIdentityVerificationCommand,
    cancelIdentityVerification: CancelIdentityVerificationCommand,
  },
  queries: {
    identityVerificationFlowStatus: IdentityVerificationFlowStatusQuery,
  },
  events: {
    identityVerificationCompleted: IdentityVerificationCompletedEvent,
  },
});
export type IdentityVerificationFlowApi = typeof identityVerificationFlowApi;
