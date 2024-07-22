import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  ChangeAccountEmailCommandRequest,
  ChangeTwoFactorAuthenticationOtpTypeCommandRequest,
  InitiateAutologinWithSSOCommandRequest,
  InitiateLoginWithSSOCommandRequest,
  LoginViaSSORequest,
  SendAccountEmailCommandRequest,
  SendMasterPasswordCommandRequest,
  SubmitBackupCodeCommandRequest,
  SubmitEmailTokenCommandRequest,
  SubmitPinCodeCommandRequest,
  SubmitTotpCommandRequest,
  WebAuthnAuthenticationFailCommandRequest,
} from "./authentication-flow.types";
export class SendAccountEmailCommand extends defineCommand<SendAccountEmailCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class ChangeAccountEmailCommand extends defineCommand<ChangeAccountEmailCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class SubmitPinCodeCommand extends defineCommand<SubmitPinCodeCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class SwitchToMasterPasswordCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SwitchToDevicetoDeviceAuthenticationCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SwitchToDashlaneAuthenticatorCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SwitchToPinCodeCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SubmitEmailTokenCommand extends defineCommand<SubmitEmailTokenCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class SubmitTotpCommand extends defineCommand<SubmitTotpCommandRequest>({
  scope: UseCaseScope.Device,
}) {}
export class SubmitBackupCodeCommand extends defineCommand<SubmitBackupCodeCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class ChangeTwoFactorAuthenticationOtpTypeCommand extends defineCommand<ChangeTwoFactorAuthenticationOtpTypeCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class ResendEmailTokenCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SendMasterPasswordCommand extends defineCommand<SendMasterPasswordCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class ResendPushNotificationCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class SwitchToEmailTokenCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class ClearErrorCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class RetryWebAuthnAuthenticationCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class WebAuthnAuthenticationFailCommand extends defineCommand<WebAuthnAuthenticationFailCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class LogoutCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class LockCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
export class LoginViaSSOCommand extends defineCommand<LoginViaSSORequest>({
  scope: UseCaseScope.Device,
}) {}
export class InitiateLoginWithSSOCommand extends defineCommand<InitiateLoginWithSSOCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class InitiateAutologinWithSSOCommand extends defineCommand<InitiateAutologinWithSSOCommandRequest>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class CancelDeviceTransferRequestCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
