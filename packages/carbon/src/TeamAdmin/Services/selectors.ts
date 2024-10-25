import { State } from "Store";
import { SpaceInfo } from "@dashlane/communication";
import { AdminData, TeamAdminData } from "Session/Store/teamAdminData";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { createSelector } from "reselect";
const teamAdminDataSelector = (state: State): TeamAdminData =>
  state.userSession.teamAdminData;
export const adminDataForTeamSelector = (
  state: State,
  teamId: string
): AdminData | undefined => {
  const teamAdminData = teamAdminDataSelector(state);
  return teamAdminData.teams ? teamAdminData.teams[teamId] : undefined;
};
export const currentTeamIdSelector = (state: State): string | undefined => {
  const space = state.userSession.spaceData.spaces.find(
    (space) => space.details.status === "accepted"
  );
  if (!space) {
    return undefined;
  }
  return space.teamId;
};
export const currentSpaceInfoSelector = (
  state: State
): SpaceInfo | undefined => {
  const space = state.userSession.spaceData.spaces.find(
    (space) => space.details.status === "accepted"
  );
  if (!space) {
    return undefined;
  }
  return space.info;
};
export const administrableUserGroupsSelector = (
  state: State
): UserGroupDownload[] => {
  const teamId = currentTeamIdSelector(state);
  if (!teamId) {
    return [];
  }
  const adminData = adminDataForTeamSelector(state, teamId);
  if (!adminData) {
    return [];
  }
  return adminData.userGroups || [];
};
export const administrableUserGroupSelector = (
  state: State,
  groupId: string
): UserGroupDownload | undefined => {
  const userGroups = administrableUserGroupsSelector(state);
  return userGroups.find((userGroup) => userGroup.groupId === groupId);
};
export const isGroupNameAvailableSelector = (
  state: State,
  name: string
): boolean => {
  const administrableUserGroups = administrableUserGroupsSelector(state);
  const nameExists = administrableUserGroups.some(
    (group) => group.name === name
  );
  return !nameExists;
};
export const getAdministrableUserGroupSelector = (groupId: string) =>
  createSelector(administrableUserGroupsSelector, (userGroups) =>
    userGroups.find((g) => g.groupId === groupId)
  );
