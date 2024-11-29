import {
  ChangeMasterPasswordError,
  FlowStep,
  UserChangeMasterPasswordEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../../../libs/logs/logEvent";
const logChangeMasterPasswordEvent = (
  flowStep: FlowStep,
  errorName?: ChangeMasterPasswordError
) => {
  logEvent(
    new UserChangeMasterPasswordEvent({
      flowStep,
      errorName: errorName ? errorName : undefined,
    })
  );
};
export const logChangeMasterPasswordStart = () =>
  logChangeMasterPasswordEvent(FlowStep.Start);
export const logChangeMasterPasswordCancel = () =>
  logChangeMasterPasswordEvent(FlowStep.Cancel);
export const logChangeMasterPasswordComplete = () =>
  logChangeMasterPasswordEvent(FlowStep.Complete);
export const logChangeMasterPasswordError = (
  errorName: ChangeMasterPasswordError
) => logChangeMasterPasswordEvent(FlowStep.Error, errorName);
