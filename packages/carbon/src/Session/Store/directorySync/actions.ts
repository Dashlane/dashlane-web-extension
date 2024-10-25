import { Action } from "Store";
export const TEAM_DIRECTORY_SYNC_IN_PROGRESS =
  "TEAM_DIRECTORY_SYNC_IN_PROGRESS";
export const TEAM_DIRECTORY_SYNC_NOT_IN_PROGRESS =
  "TEAM_DIRECTORY_SYNC_NOT_IN_PROGRESS";
export interface TeamDirectorySyncInProgressAction extends Action {
  teamId: string;
}
export const teamDirectorySyncInProgress = (
  teamId: string
): TeamDirectorySyncInProgressAction => ({
  type: TEAM_DIRECTORY_SYNC_IN_PROGRESS,
  teamId,
});
export interface TeamDirectorySyncNotInProgressAction extends Action {
  teamId: string;
}
export const teamDirectorySyncNotInProgress = (
  teamId: string
): TeamDirectorySyncNotInProgressAction => ({
  type: TEAM_DIRECTORY_SYNC_NOT_IN_PROGRESS,
  teamId,
});
