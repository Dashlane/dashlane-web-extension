import { AuthenticatorEvents } from "./dashlane-authenticator/dashlane-authenticator.machine";
import { EmailTokenEvents } from "./email-token/email.token.machine";
export interface DashlaneAuthenticatorDoneEvent {
  type: "done.state.DeviceRegistrationMachine.DashlaneAuthenticator";
  data: {
    switchToEmailToken: boolean;
  };
}
export interface EmailTokenDoneEvent {
  type: "done.state.DeviceRegistrationMachine.EmailToken";
  data: {
    switchToDashlaneAuthenticator: boolean;
  };
}
export interface CarbonLegacyErrorEvent {
  type: "CARBON_LEGACY_ERROR";
  error: string;
}
export type DeviceRegistrationEvents =
  | AuthenticatorEvents
  | EmailTokenEvents
  | DashlaneAuthenticatorDoneEvent
  | EmailTokenDoneEvent
  | CarbonLegacyErrorEvent;
