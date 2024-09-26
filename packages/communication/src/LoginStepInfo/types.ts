export enum LoginStep {
  Email = "email",
  Welcome = "welcome",
  OTP1 = "OTP1",
  OTP2 = "OTP2",
  BackupCodeOTP1 = "backupCodeOTP1",
  BackupCodeOTP2 = "backupCodeOTP2",
  OTPToken = "token",
  Password = "password",
  SSO = "SSO",
  ActivateSSO = "activateSSO",
  WebAuthn = "webAuthn",
  WebAuthnError = "webAuthnError",
  DeviceLimitReached = "deviceLimitReached",
  DashlaneAuthenticator = "dashlaneAuthenticator",
  PasswordLess = "passwordLess",
}
export interface LoginStepInfo {
  step: AllowedOngoingLoginStep;
  login: string;
}
export type AllowedOngoingLoginStep =
  | LoginStep.Password
  | LoginStep.WebAuthn
  | LoginStep.WebAuthnError
  | LoginStep.OTP1
  | LoginStep.OTP2
  | LoginStep.BackupCodeOTP1
  | LoginStep.BackupCodeOTP2
  | LoginStep.OTPToken
  | LoginStep.ActivateSSO
  | LoginStep.DeviceLimitReached
  | LoginStep.DashlaneAuthenticator
  | LoginStep.PasswordLess;
export interface UpdateLoginStepInfoRequest {
  step?: AllowedOngoingLoginStep;
  login?: string;
}
