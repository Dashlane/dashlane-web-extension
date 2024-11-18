import {
  TEAM_DIRECTORY_SYNC_IN_PROGRESS,
  TEAM_DIRECTORY_SYNC_NOT_IN_PROGRESS,
  TeamDirectorySyncInProgressAction,
  TeamDirectorySyncNotInProgressAction,
} from "Session/Store/directorySync/actions";
export interface DirectorySync {
  syncsInProgress: {
    [teamId: string]: boolean;
  };
}
export function getEmptyState(): DirectorySync {
  return {
    syncsInProgress: {},
  };
}
export function isTeamDirectorySyncInProgress(
  state: DirectorySync,
  teamId: string
): boolean {
  return state.syncsInProgress[teamId];
}
export default (state = getEmptyState(), action: any): DirectorySync => {
  switch (action.type) {
    case TEAM_DIRECTORY_SYNC_IN_PROGRESS:
      const { teamId: teamIdInProgress } =
        action as TeamDirectorySyncInProgressAction;
      return {
        ...state,
        syncsInProgress: {
          ...state.syncsInProgress,
          [teamIdInProgress]: true,
        },
      };
    case TEAM_DIRECTORY_SYNC_NOT_IN_PROGRESS:
      const { teamId: teamIdNotInProgress } =
        action as TeamDirectorySyncNotInProgressAction;
      return {
        ...state,
        syncsInProgress: {
          ...state.syncsInProgress,
          [teamIdNotInProgress]: false,
        },
      };
    default:
      return state;
  }
};
