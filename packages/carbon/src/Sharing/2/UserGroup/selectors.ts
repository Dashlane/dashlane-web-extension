import { compose } from "ramda";
import { createSelector } from "reselect";
import {
  MemberPermission,
  UserGroupDataQueryRequest,
  UserGroupPermissionLevelRequest,
  UserGroupView,
} from "@dashlane/communication";
import { viewListResults } from "DataManagement/Search/views";
import { getQuerySelector } from "DataManagement/query-selector";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { userIdSelector } from "Session/selectors";
import { userGroupMatch } from "Sharing/2/UserGroup/search";
import { getUserGroupMappers } from "Sharing/2/UserGroup/mappers";
import { UserGroup } from "Sharing/2/UserGroup/types";
import { detailView, listView } from "Sharing/2/UserGroup/views";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import {
  doesItemGroupExistInSpace,
  findMyAcceptedUserGroups,
  findUserGroup,
  findUserGroupItemGroups,
  getUserGroupPermission,
} from "Sharing/2/Services/SharingHelpers";
import { State } from "Store";
import { itemItemGroupSelector } from "Sharing/2/Services/selectors";
export const createActiveUserGroupsSelector = (spaceId: string) => {
  return createSelector(
    sharingDataSelector,
    userIdSelector,
    (state) => state,
    (sharingData, userId, state): UserGroup[] => {
      const { userGroups, itemGroups } = sharingData;
      const acceptedUserGroups = findMyAcceptedUserGroups(userGroups, userId);
      return acceptedUserGroups.map((userGroup) => {
        const userGroupItemGroups = findUserGroupItemGroups(
          userGroup.groupId,
          itemGroups
        );
        const itemCount = userGroupItemGroups.reduce((acc, itemGroup) => {
          if (
            spaceId !== null &&
            !doesItemGroupExistInSpace(state, itemGroup, spaceId)
          ) {
            return acc;
          }
          return acc + itemGroup.items.length;
        }, 0);
        return {
          ...userGroup,
          itemCount,
        };
      });
    }
  );
};
export const userGroupMappersSelector = () => getUserGroupMappers();
const userGroupMatchSelector = () => userGroupMatch;
const createQuerySelector = (spaceId: string) => {
  const activeUserGroupsSelector = createActiveUserGroupsSelector(spaceId);
  return getQuerySelector(
    activeUserGroupsSelector,
    userGroupMatchSelector,
    userGroupMappersSelector
  );
};
export const viewedUserGroupsSelector = (
  state: State,
  params: UserGroupDataQueryRequest
) => {
  const querySelector = createQuerySelector(params.spaceId);
  const viewComposition = compose(viewListResults(listView), querySelector);
  return viewComposition(state, params.dataQuery);
};
export const createLiveUserGroupsSelector = (spaceId: string) => {
  const activeUserGroupsSelector = createActiveUserGroupsSelector(spaceId);
  return makeLiveSelectorGetter(
    activeUserGroupsSelector,
    () => listView,
    userGroupMatchSelector,
    userGroupMappersSelector
  );
};
export const viewedUserGroupSelector = (
  state: State,
  groupId: string
): UserGroupView | undefined => {
  const { itemGroups } = sharingDataSelector(state);
  const activeUserGroupsSelector = createActiveUserGroupsSelector(null);
  const activeUserGroups = activeUserGroupsSelector(state);
  const userGroupDownload = findUserGroup(activeUserGroups, groupId);
  const itemCount = findUserGroupItemGroups(
    userGroupDownload.groupId,
    itemGroups
  ).length;
  if (!userGroupDownload) {
    return undefined;
  }
  return detailView({ ...userGroupDownload, itemCount });
};
export const userGroupPermissionLevelSelector = (
  state: State,
  { itemId, groupId }: UserGroupPermissionLevelRequest
): MemberPermission | undefined => {
  const itemGroup = itemItemGroupSelector(state, itemId);
  return getUserGroupPermission(itemGroup, groupId);
};
export const getUserGroupPermissionLevelSelector = ({
  itemId,
  groupId,
}: UserGroupPermissionLevelRequest) => {
  return (state: State) =>
    userGroupPermissionLevelSelector(state, { itemId, groupId });
};
