import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AdminPermissionLevel, UserConsent } from "@dashlane/communication";
import { DeviceRegistrationEvents } from "../device-registration-flow/device-registration.events";
import { MasterPasswordFlowEvents } from "../master-password-flow/master-password.events";
import { TwoFactorAuthenticationEvents } from "../two-factor-authentication-flow/two-factor-authentication.events";
import { WebAuthnEvents } from "../webauthn-flow/webauthn.events";
import { PinCodeMachineEvents } from "../pin-code-flow/pin-code.events";
import { MachineInitializationResult } from "./types";
import { DeviceToDeviceAuthenticationFlowEvents } from "../device-to-device-authentication-flow";
export interface CarbonLegacyAskMasterPasswordEvent {
  type: "CARBON_LEGACY_ASK_MASTER_PASSWORD";
  serverKey?: string;
}
export interface CarbonLegacyErrorEvent {
  type: "CARBON_LEGACY_ERROR";
  error: string;
}
export interface CarbonWrongPasswordEvent {
  type: "CARBON_WRONG_PASSWORD";
}
export interface CarbonLegacyOpenSessionDashlaneAuthenticatorEvent {
  type: "CARBON_LEGACY_OPEN_SESSION_DASHLANE_AUTHENTICATOR";
}
export interface CarbonLegacyOtpSentEvent {
  type: "CARBON_LEGACY_OPEN_SESSION_OTP_SENT";
  otpVerificationMode: AuthenticationFlowContracts.AuthenticationFlowOtpVerificationMode;
}
export interface CarbonLegacyEmailTokenSentEvent {
  type: "CARBON_LEGACY_OPEN_SESSION_TOKEN_SENT";
  login: string;
}
export interface LegacySSOLoginEvent {
  type: "CARBON_LEGACY_SSO_LOGIN_BYPASS";
  consents?: UserConsent[];
  anonymousUserId?: string;
  deviceName: string;
  exist: boolean;
  ssoServiceProviderKey: string;
  login: string;
  ssoToken: string;
  currentAuths: AuthenticationFlowContracts.SsoMigrationServerMethod;
  expectedAuths: AuthenticationFlowContracts.SsoMigrationServerMethod;
  inStore: boolean;
  requiredPermissions: AdminPermissionLevel | null;
  shouldRememberMeForSSO?: boolean;
}
export interface InputAccountEmailEvent {
  type: "INPUT_ACCOUNT_EMAIL";
  login: string;
}
export interface InputChangeAccountEmailEvent {
  type: "CHANGE_ACCOUNT_EMAIL";
  login?: string;
}
export interface InitializationDoneEvent {
  type: "done.invoke.AuthenticationFlowMachine.Starting";
  data: MachineInitializationResult;
}
export interface CarbonLegacySsoRedirectionToIdpRequiredEvent {
  type: "CARBON_LEGACY_OPEN_SESSION_SSO_REDIRECTION_TO_IDP_REQUIRED";
  serviceProviderRedirectUrl: string;
  isNitroProvider: boolean;
  rememberMeForSSOPreference: boolean;
}
export interface CarbonLegacyOpenSessionMasterDeviceToDeviceAuthenticationEvent {
  type: "CARBON_LEGACY_OPEN_SESSION_DEVICE_TO_DEVICE";
}
export interface WebAuthnDoneEvent {
  type: "done.state.AuthenticationFlowMachine.WebAuthn";
  data: {
    switchToMasterPassword: boolean;
    switchToPinCode: boolean;
  };
}
export interface ClearErrorEvent {
  type: "CLEAR_ERROR";
}
export interface MasterPasswordFinishedEvent {
  type: "done.state.AuthenticationFlowMachine.MasterPassword";
  data: {
    shouldResetAuthenticationFlow: boolean;
  };
}
export interface CarbonLegacyLoggedOutEvent {
  type: "CARBON_LEGACY_LOGGED_OUT";
}
export interface TwoFactorAuthenticationDoneEvent {
  type: "done.state.AuthenticationFlowMachine.TwoFactorAuthentication";
}
export interface CheckPinEnabledForAccountDoneEvent<T extends string = string> {
  type: `done.invoke.AuthenticationFlowMachine.ValidatingEmail${T}`;
  data: boolean;
}
export type AuthenticationMachineEvents =
  | CarbonLegacyErrorEvent
  | MasterPasswordFinishedEvent
  | ClearErrorEvent
  | InitializationDoneEvent
  | DeviceRegistrationEvents
  | MasterPasswordFlowEvents
  | TwoFactorAuthenticationEvents
  | TwoFactorAuthenticationDoneEvent
  | WebAuthnEvents
  | PinCodeMachineEvents
  | InputChangeAccountEmailEvent
  | CarbonLegacyAskMasterPasswordEvent
  | CarbonLegacyOpenSessionDashlaneAuthenticatorEvent
  | CarbonLegacyOtpSentEvent
  | CarbonLegacyEmailTokenSentEvent
  | CarbonLegacyLoggedOutEvent
  | InputAccountEmailEvent
  | LegacySSOLoginEvent
  | CarbonLegacySsoRedirectionToIdpRequiredEvent
  | CarbonLegacyOpenSessionMasterDeviceToDeviceAuthenticationEvent
  | WebAuthnDoneEvent
  | DeviceToDeviceAuthenticationFlowEvents
  | CheckPinEnabledForAccountDoneEvent
  | PinCodeMachineEvents
  | CarbonWrongPasswordEvent;
