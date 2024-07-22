export interface WebAuthnAuthenticationFailEvent {
  type: "WEBAUTHN_AUTHENTICATION_FAIL";
  error: string;
}
export interface RetryWebAuthnAuthentication {
  type: "RETRY_WEBAUTHN_AUTHENTICATION";
}
export interface UseMasterPasswordEvent {
  type: "USE_MASTER_PASSWORD";
}
export interface UsePinCodeEvent {
  type: "SWITCH_TO_PIN_CODE";
}
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export type WebAuthnEvents =
  | ClearErrorEvent
  | UseMasterPasswordEvent
  | UsePinCodeEvent
  | WebAuthnAuthenticationFailEvent
  | RetryWebAuthnAuthentication;
