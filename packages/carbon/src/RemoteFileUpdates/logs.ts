import {
  FlowStep,
  PackageSource,
  RemoteFileUpdateError,
  UserReceiveRemoteFileUpdateEvent,
} from "@dashlane/hermes";
import { EventLoggerService } from "Logs/EventLogger";
const logReceiveRemoteFileUpdateEvent = (
  eventLoggerService: EventLoggerService,
  flowStep: FlowStep,
  remoteFileUpdateError: RemoteFileUpdateError = undefined
) => {
  eventLoggerService.logEvent(
    new UserReceiveRemoteFileUpdateEvent({
      flowStep,
      remoteFileUpdateError,
      packageSource: PackageSource.Carbon,
    })
  );
};
export const logReceiveRemoteFileSuccess = (
  eventLoggerService: EventLoggerService
) => logReceiveRemoteFileUpdateEvent(eventLoggerService, FlowStep.Complete);
export const logReceiveRemoteFileError = (
  eventLoggerService: EventLoggerService,
  error: RemoteFileUpdateError
) => logReceiveRemoteFileUpdateEvent(eventLoggerService, FlowStep.Error, error);
