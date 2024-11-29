import { logEvent } from "../../../../libs/logs/logEvent";
import {
  FlowStep,
  TwoFactorAuthenticationError,
  UserDeleteU2fAuthenticatorEvent,
} from "@dashlane/hermes";
const logDeleteU2FAuthenticatorEvent = (
  step: FlowStep,
  error?: TwoFactorAuthenticationError
) => {
  logEvent(
    new UserDeleteU2fAuthenticatorEvent({
      flowStep: step,
      errorName: error,
    })
  );
};
export const logDeleteU2FAuthenticatorStart =
  logDeleteU2FAuthenticatorEvent.bind(null, FlowStep.Start);
export const logDeleteU2FAuthenticatorCancel =
  logDeleteU2FAuthenticatorEvent.bind(null, FlowStep.Cancel);
export const logDeleteU2FAuthenticatorComplete =
  logDeleteU2FAuthenticatorEvent.bind(null, FlowStep.Complete);
export const logDeleteU2FAuthenticatorError = (
  errorName: TwoFactorAuthenticationError
) => logDeleteU2FAuthenticatorEvent(FlowStep.Error, errorName);
