import {
  ChangeMasterPasswordError,
  DeleteKeyReason,
  FlowStep,
  UserChangeMasterPasswordEvent,
  UserDeleteAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import { EventLoggerService } from "Logs/EventLogger";
const logChangeMasterPasswordEvent = (
  eventLoggerService: EventLoggerService,
  flowStep: FlowStep,
  errorName?: ChangeMasterPasswordError,
  wasLeaked?: boolean,
  wasWeak?: boolean
) => {
  eventLoggerService.logEvent(
    new UserChangeMasterPasswordEvent({
      flowStep,
      errorName: errorName ? errorName : undefined,
      isLeaked: wasLeaked,
      isWeak: wasWeak,
    })
  );
};
export const logChangeMasterPasswordStart = (
  eventLoggerService: EventLoggerService
) => logChangeMasterPasswordEvent(eventLoggerService, FlowStep.Start);
export const logChangeMasterPasswordCancel = (
  eventLoggerService: EventLoggerService
) => logChangeMasterPasswordEvent(eventLoggerService, FlowStep.Cancel);
export const logChangeMasterPasswordComplete = (
  eventLoggerService: EventLoggerService,
  wasLeaked: boolean | undefined,
  wasWeak: boolean | undefined
) =>
  logChangeMasterPasswordEvent(
    eventLoggerService,
    FlowStep.Complete,
    undefined,
    wasLeaked,
    wasWeak
  );
export const logChangeMasterPasswordError = (
  eventLoggerService: EventLoggerService,
  errorName: ChangeMasterPasswordError
) =>
  logChangeMasterPasswordEvent(eventLoggerService, FlowStep.Error, errorName);
export const logUserDeleteAccountRecoveryKey = (
  eventLoggerService: EventLoggerService
) => {
  eventLoggerService.logEvent(
    new UserDeleteAccountRecoveryKeyEvent({
      deleteKeyReason: DeleteKeyReason.VaultKeyChanged,
    })
  );
};
