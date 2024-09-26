import { SyncType } from "Libs/Backup/types";
import { assertUnreachable } from "Helpers/assert-unreachable";
export const syncTypeForSyncLogger = (syncType: SyncType) => {
  switch (syncType) {
    case SyncType.LIGHT_SYNC:
      return "Light";
    case SyncType.FULL_SYNC:
      return "Full";
    case SyncType.FIRST_SYNC:
      return "Initial";
    default:
      assertUnreachable(syncType);
  }
};
