import { SyncState, SyncStatuses } from "@dashlane/communication";
import {
  SYNC_FAILURE,
  SYNC_STARTED,
  SYNC_SUCCESS,
} from "Session/Store/sync/actions";
import { Action } from "Store";
export function getEmptySyncState(): SyncState {
  return {
    isUploadEnabled: false,
    syncIntervalTimeMs: 1000 * 60 * 5,
    status: SyncStatuses.READY,
  };
}
export default (state = getEmptySyncState(), action: Action): SyncState => {
  switch (action.type) {
    case SYNC_STARTED:
      return {
        ...state,
        startTime: action.startTime,
        status: SyncStatuses.IN_PROGRESS,
      };
    case SYNC_FAILURE:
      return {
        ...state,
        status: SyncStatuses.FAILURE,
      };
    case SYNC_SUCCESS:
      return {
        ...state,
        status: SyncStatuses.SUCCESS,
        isUploadEnabled: action.isUploadEnabled,
      };
    default:
      return state;
  }
};
