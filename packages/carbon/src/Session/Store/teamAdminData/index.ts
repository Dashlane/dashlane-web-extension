import {
  TeamAdminData,
  TeamAdminDataDictionary,
} from "Session/Store/teamAdminData/types";
export { TeamAdminData, AdminData } from "./types";
import {
  GROUP_ADMIN_ITEM_CREATED,
  SPECIAL_ITEM_GROUP_UPDATED,
  SpecialItemGroupUpdatedAction,
  TEAM_ADMIN_DATA_UPDATED,
  TEAM_ADMIN_USER_GROUPS_CREATED,
  TEAM_ADMIN_USER_GROUPS_DELETED,
  TEAM_ADMIN_USER_GROUPS_UPDATED,
  TeamAdminDataUpdatedAction,
  UserGroupAdminItemCreatedAction,
  UserGroupsCreatedAction,
  UserGroupsDeletedAction,
  UserGroupsUpdatedAction,
} from "Session/Store/teamAdminData/actions";
function mergeTeamAdminDataDictionaries(
  sourceDictionary: TeamAdminDataDictionary,
  updateDictionary: TeamAdminDataDictionary
): TeamAdminDataDictionary {
  const mergedDictionary = {};
  Object.keys(sourceDictionary).forEach((teamId: string) => {
    mergedDictionary[teamId] = sourceDictionary[teamId];
  });
  Object.keys(updateDictionary).forEach((teamId: string) => {
    mergedDictionary[teamId] = Object.assign(
      {},
      mergedDictionary[teamId],
      updateDictionary[teamId]
    );
  });
  return mergedDictionary;
}
function getGroupsAdminItemsForTeam(
  sourceDictionary: TeamAdminDataDictionary,
  teamId: string
) {
  return (
    (sourceDictionary[teamId] &&
      sourceDictionary[teamId].userGroupAdminItems) ||
    []
  );
}
export default (state = getEmptyState(), action: any): TeamAdminData => {
  switch (action.type) {
    case TEAM_ADMIN_DATA_UPDATED:
      const { teamAdminData } = action as TeamAdminDataUpdatedAction;
      return {
        teams: mergeTeamAdminDataDictionaries(state.teams, teamAdminData.teams),
      };
    case TEAM_ADMIN_USER_GROUPS_UPDATED:
      const teamAdminDataUpdatedAction = action as UserGroupsUpdatedAction;
      return {
        teams: mergeTeamAdminDataDictionaries(state.teams, {
          [teamAdminDataUpdatedAction.teamId]: {
            teamId: teamAdminDataUpdatedAction.teamId,
            userGroups: teamAdminDataUpdatedAction.userGroups,
          },
        }),
      };
    case TEAM_ADMIN_USER_GROUPS_CREATED:
      const userGroupsCreatedAction = action as UserGroupsCreatedAction;
      const userGroupsBeforeUpdate = state.teams[userGroupsCreatedAction.teamId]
        ? state.teams[userGroupsCreatedAction.teamId].userGroups
        : [];
      return {
        teams: mergeTeamAdminDataDictionaries(state.teams, {
          [userGroupsCreatedAction.teamId]: {
            teamId: userGroupsCreatedAction.teamId,
            userGroups: userGroupsBeforeUpdate.concat(
              userGroupsCreatedAction.userGroups
            ),
          },
        }),
      };
    case TEAM_ADMIN_USER_GROUPS_DELETED:
      const userGroupsDeletedAction = action as UserGroupsDeletedAction;
      const deletedUserGroupIds = userGroupsDeletedAction.userGroups.map(
        (userGroup) => userGroup.groupId
      );
      const userGroupsBeforeDeletion = state.teams[
        userGroupsDeletedAction.teamId
      ]
        ? state.teams[userGroupsDeletedAction.teamId].userGroups
        : [];
      return {
        teams: mergeTeamAdminDataDictionaries(state.teams, {
          [userGroupsDeletedAction.teamId]: {
            teamId: userGroupsDeletedAction.teamId,
            userGroups: userGroupsBeforeDeletion.filter(
              (userGroup) => !deletedUserGroupIds.includes(userGroup.groupId)
            ),
          },
        }),
      };
    case GROUP_ADMIN_ITEM_CREATED:
      const userGroupAdminItemCreatedAction =
        action as UserGroupAdminItemCreatedAction;
      const currentUserGroupAdminItems = getGroupsAdminItemsForTeam(
        state.teams,
        userGroupAdminItemCreatedAction.teamId
      );
      return {
        teams: mergeTeamAdminDataDictionaries(state.teams, {
          [userGroupAdminItemCreatedAction.teamId]: {
            teamId: userGroupAdminItemCreatedAction.teamId,
            userGroupAdminItems: currentUserGroupAdminItems.concat([
              userGroupAdminItemCreatedAction.userGroupAdminItem,
            ]),
          },
        }),
      };
    case SPECIAL_ITEM_GROUP_UPDATED:
      const specialItemGroupUpdatedAction =
        action as SpecialItemGroupUpdatedAction;
      return {
        teams: mergeTeamAdminDataDictionaries(state.teams, {
          [specialItemGroupUpdatedAction.teamId]: {
            teamId: specialItemGroupUpdatedAction.teamId,
            specialItemGroup: action.specialItemGroup,
          },
        }),
      };
    default:
      return state;
  }
};
export function getEmptyState(): TeamAdminData {
  return {
    teams: {},
  };
}
