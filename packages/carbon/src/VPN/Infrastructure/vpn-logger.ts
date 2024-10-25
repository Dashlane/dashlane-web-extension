import {
  ActivateVpnError,
  FlowStep,
  UserActivateVpnEvent,
} from "@dashlane/hermes";
import { logEvent } from "Logs/EventLogger/services";
import { CoreServices } from "Services";
import { VpnErrorType, VpnLogger } from "./types";
const ErrorMapping: Record<VpnErrorType, ActivateVpnError> = {
  [VpnErrorType.AccountAlreadyExistError]: ActivateVpnError.EmailAlreadyInUse,
  [VpnErrorType.ServerError]: ActivateVpnError.ServerError,
};
export const makeVpnLogger = (services: CoreServices): VpnLogger => ({
  logComplete: async () => {
    await logEvent(services, {
      event: new UserActivateVpnEvent({
        flowStep: FlowStep.Complete,
      }),
    });
  },
  logError: async (error) => {
    await logEvent(services, {
      event: new UserActivateVpnEvent({
        flowStep: FlowStep.Error,
        errorName: ErrorMapping[error],
      }),
    });
  },
  logStart: async () => {
    await logEvent(services, {
      event: new UserActivateVpnEvent({
        flowStep: FlowStep.Start,
      }),
    });
  },
});
