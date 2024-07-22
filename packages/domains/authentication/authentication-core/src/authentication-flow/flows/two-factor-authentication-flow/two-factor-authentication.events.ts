import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
export interface InputTotpEvent {
  type: "INPUT_TOTP";
  twoFactorAuthenticationOtpValue: string;
}
export interface CarbonLegacyOtpSentEvent {
  type: "CARBON_LEGACY_OPEN_SESSION_OTP_SENT";
  otpVerificationMode: AuthenticationFlowContracts.AuthenticationFlowOtpVerificationMode;
}
export interface SwitchTwoFactorAuthenticationTypeEvent {
  type: "SWITCH_TWO_FACTOR_AUTHENTICATION_TYPE";
  twoFactorAuthenticationOtpType: AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpType;
}
export interface InputBackupCodeEvent {
  type: "INPUT_BACKUP_CODE";
  twoFactorAuthenticationOtpValue: string;
}
export interface LegacyErrorEvent {
  type: "CARBON_LEGACY_ERROR";
  error: string;
}
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export type TwoFactorAuthenticationEvents =
  | ClearErrorEvent
  | InputTotpEvent
  | SwitchTwoFactorAuthenticationTypeEvent
  | InputBackupCodeEvent
  | LegacyErrorEvent
  | CarbonLegacyOtpSentEvent;
