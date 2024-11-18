import { EventLoggerService } from "Logs/EventLogger";
import { logReceiveRemoteFileError } from "RemoteFileUpdates/logs";
import { RemoteFileUpdateError } from "@dashlane/hermes";
import { sendExceptionLog } from "Logs/Exception";
export class RemoteFileError extends Error {
  static readonly errorInstance = "REMOTE_FILE_ERROR";
  constructor(public name: RemoteFileUpdateError, message?: string) {
    super(message);
    this.name = name;
  }
}
function isRemoteFileError(error: unknown): error is RemoteFileError {
  return error instanceof RemoteFileError;
}
export function assertRemoteFileError(
  eventLoggerService: EventLoggerService,
  error: Error
) {
  if (isRemoteFileError(error)) {
    logReceiveRemoteFileError(eventLoggerService, error.name);
  } else {
    sendExceptionLog({ error });
  }
}
