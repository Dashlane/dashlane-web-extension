import { createSelector } from "reselect";
import { compose } from "ramda";
import {
  UserDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { GetUserGroupMembersRequest } from "@dashlane/communication";
import { getQuerySelector } from "DataManagement/query-selector";
import { State } from "Store";
import { getUserDownloadMappers } from "Sharing/2/UserGroup/UserGroupMembers/mappers";
import { userDownloadMatch } from "Sharing/2/UserGroup/UserGroupMembers/search";
import { viewListResults } from "DataManagement/Search/views";
import { listView } from "Sharing/2/UserGroup/UserGroupMembers/views";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import { userIdSelector } from "Session/selectors";
import {
  findMyAcceptedUserGroups,
  findUserGroup,
} from "Sharing/2/Services/SharingHelpers";
export const activeUserGroupsSelector = createSelector(
  sharingDataSelector,
  userIdSelector,
  (sharingData, userId) => {
    const { userGroups } = sharingData;
    return findMyAcceptedUserGroups(userGroups, userId);
  }
);
export const getUserGroupSelector = (groupId: string) =>
  createSelector(
    activeUserGroupsSelector,
    (userGroups): UserGroupDownload | undefined => {
      return findUserGroup(userGroups, groupId);
    }
  );
const getActiveUserGroupMembersSelector = (groupId: string) => {
  const userGroupSelector = getUserGroupSelector(groupId);
  return createSelector(
    userGroupSelector,
    (userGroup: UserGroupDownload | undefined): UserDownload[] => {
      return userGroup?.users || [];
    }
  );
};
export const userDownloadMappersSelector = () => getUserDownloadMappers();
const userDownloadMatchSelector = () => userDownloadMatch;
const createQuerySelector = (groupId: string) => {
  const activeUserGroupMembersSelector =
    getActiveUserGroupMembersSelector(groupId);
  return getQuerySelector(
    activeUserGroupMembersSelector,
    userDownloadMatchSelector,
    userDownloadMappersSelector
  );
};
export const viewedUserGroupMembersSelector = (
  state: State,
  params: GetUserGroupMembersRequest
) => {
  const querySelector = createQuerySelector(params.groupId);
  const viewComposition = compose(viewListResults(listView), querySelector);
  return viewComposition(state, params.dataQuery);
};
