import { Action } from "Store";
export const SYNC_STARTED = "SYNC_STARTED";
export const SYNC_SUCCESS = "SYNC_SUCCESS";
export const SYNC_FAILURE = "SYNC_FAILURE";
export const syncStarted = (): Action => ({
  type: SYNC_STARTED,
  isInProgress: true,
  startTime: Date.now(),
});
export const syncSuccess = (isUploadEnabled: boolean): Action => ({
  type: SYNC_SUCCESS,
  isInProgress: false,
  isUploadEnabled,
});
export const syncFailure = (): Action => ({
  type: SYNC_FAILURE,
  isInProgress: false,
});
