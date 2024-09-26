import { ErrorName, Extent, Trigger, UserSyncEvent } from "@dashlane/hermes";
import { AuthenticationCode } from "@dashlane/communication";
import { SyncType } from "Libs/Backup/types";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { CarbonError, isCarbonError } from "Libs/Error";
import { HttpError, HttpErrorCode } from "Libs/Http";
import { WSError } from "Libs/WS/Errors";
type InitialUserSyncEvent = Partial<UserSyncEvent> &
  Pick<UserSyncEvent, "extent" | "trigger" | "timestamp" | "duration">;
export const createInitialSyncEvent = (
  syncType: SyncType,
  trigger: Trigger,
  startTime: number
): InitialUserSyncEvent => {
  return {
    extent: getSyncEventExtent(syncType),
    trigger: trigger,
    timestamp: startTime,
    duration: {
      sync: 0,
      chronological: 0,
      treat_problem: 0,
      sharing: 0,
    },
  };
};
export const getSyncEventExtent = (syncType: SyncType) => {
  switch (syncType) {
    case SyncType.LIGHT_SYNC:
      return Extent.Light;
    case SyncType.FULL_SYNC:
      return Extent.Full;
    case SyncType.FIRST_SYNC:
      return Extent.Initial;
    default:
      assertUnreachable(syncType);
  }
};
export function getSyncEventErrorName(error: unknown): ErrorName {
  let errorName = ErrorName.Other;
  const isHttpStatusError = ({ errorCode }: CarbonError<HttpErrorCode>) => {
    return (
      errorCode === HttpErrorCode.CLIENT_ERROR ||
      errorCode === HttpErrorCode.SERVER_ERROR ||
      errorCode === HttpErrorCode.STATUS_CODE
    );
  };
  if (isCarbonError(error)) {
    if (error.errorType === HttpError) {
      errorName = isHttpStatusError(error)
        ? ErrorName.HttpStatus
        : ErrorName.HttpIo;
    } else if (error.errorType === WSError) {
      errorName = ErrorName.ResponseContent;
    }
  }
  if (
    error instanceof Error &&
    error?.message &&
    typeof AuthenticationCode[error.message] !== "undefined"
  ) {
    errorName = ErrorName.Authentication;
  }
  return errorName;
}
