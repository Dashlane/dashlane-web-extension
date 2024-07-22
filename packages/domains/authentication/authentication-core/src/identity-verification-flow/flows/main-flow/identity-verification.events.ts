import { DeviceRegistrationEvents } from "../device-registration-flow/device-registration.events";
import { TwoFactorAuthenticationEvents } from "../two-factor-authentication-flow/two-factor-authentication.events";
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export interface TwoFactorAuthenticationDoneEvent {
  type: "done.state.IdentityVerificationFlowMachine.TwoFactorAuthentication";
}
export interface VerifyIdentityWithTokenEvent {
  type: "VERIFY_IDENTITY_WITH_TOKEN";
  login: string;
}
export interface VerifyIdentityWithTotpEvent {
  type: "VERIFY_IDENTITY_WITH_TOTP";
  login: string;
}
export interface VerifyIdentityWithDashlaneAuthenticatorEvent {
  type: "VERIFY_IDENTITY_WITH_DASHLANE_AUTHENTICATOR";
  login: string;
}
export interface CancelIdentityVerificationEvent {
  type: "CANCEL_IDENTITY_VERIFICATION";
}
export type IdentityVerificationMachineEvents =
  | ClearErrorEvent
  | DeviceRegistrationEvents
  | TwoFactorAuthenticationEvents
  | TwoFactorAuthenticationDoneEvent
  | VerifyIdentityWithTokenEvent
  | VerifyIdentityWithTotpEvent
  | CancelIdentityVerificationEvent
  | VerifyIdentityWithDashlaneAuthenticatorEvent;
