import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  ChangeTwoFactorAuthenticationOtpTypeCommandRequest,
  StartIdentityVerificationCommandRequest,
  SubmitBackupCodeCommandRequest,
  SubmitEmailTokenCommandRequest,
  SubmitTotpCommandRequest,
} from "./identity-verification-flow.types";
export class ChangeTwoFactorAuthenticationOtpTypeCommand extends defineCommand<ChangeTwoFactorAuthenticationOtpTypeCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class ClearIdentityVerificationErrorCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class ResendEmailTokenCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class ResendPushNotificationCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SubmitEmailTokenCommand extends defineCommand<SubmitEmailTokenCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class SubmitBackupCodeCommand extends defineCommand<SubmitBackupCodeCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class SubmitTotpCommand extends defineCommand<SubmitTotpCommandRequest>({
  scope: UseCaseScope.Device,
}) {}
export class SwitchToDashlaneAuthenticatorCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SwitchToEmailTokenCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class StartIdentityVerificationCommand extends defineCommand<StartIdentityVerificationCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class CancelIdentityVerificationCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
