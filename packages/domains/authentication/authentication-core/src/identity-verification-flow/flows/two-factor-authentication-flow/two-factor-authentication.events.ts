import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
export interface InputTotpEvent {
  type: "INPUT_TOTP";
  twoFactorAuthenticationOtpValue: string;
}
export interface SwitchTwoFactorAuthenticationTypeEvent {
  type: "SWITCH_TWO_FACTOR_AUTHENTICATION_TYPE";
  twoFactorAuthenticationOtpType: IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpType;
}
export interface InputBackupCodeEvent {
  type: "INPUT_BACKUP_CODE";
  twoFactorAuthenticationOtpValue: string;
}
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export type TwoFactorAuthenticationEvents =
  | ClearErrorEvent
  | InputTotpEvent
  | SwitchTwoFactorAuthenticationTypeEvent
  | InputBackupCodeEvent;
