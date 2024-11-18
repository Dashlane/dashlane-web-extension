import { compose } from "ramda";
import { createSelector } from "reselect";
import {
  MemberPermission,
  SharingUserDataQueryRequest,
  SharingUserPermissionLevelRequest,
} from "@dashlane/communication";
import { SharingUser } from "Sharing/2/SharingUser/types";
import { viewListResults } from "DataManagement/Search/views";
import { getQuerySelector } from "DataManagement/query-selector";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { userIdSelector } from "Session/selectors";
import { getSharingUserMappers } from "Sharing/2/SharingUser/mappers";
import { listView } from "Sharing/2/SharingUser/views";
import { sharingUserMatch } from "Sharing/2/SharingUser/search";
import {
  getSharingUserPermission,
  getSharingUsersFromItemGroups,
} from "Sharing/2/Services/SharingHelpers";
import { acceptedItemGroupsSelector } from "Sharing/2/Services/selectors/accepted-item-groups.selector";
import { itemItemGroupSelector } from "Sharing/2/Services/selectors";
import { State } from "Store";
const createAcceptedSharingUsersSelector = (spaceId: string) => {
  return createSelector(
    acceptedItemGroupsSelector,
    userIdSelector,
    (state) => state,
    (itemGroups, userId, state): SharingUser[] => {
      return getSharingUsersFromItemGroups(state, userId, itemGroups, spaceId);
    }
  );
};
export const sharingUserMappersSelector = () => getSharingUserMappers();
const sharingUserMatchSelector = () => sharingUserMatch;
const createQuerySelector = (spaceId: string) => {
  const acceptedSharingUsersSelector =
    createAcceptedSharingUsersSelector(spaceId);
  return getQuerySelector(
    acceptedSharingUsersSelector,
    sharingUserMatchSelector,
    sharingUserMappersSelector
  );
};
export const viewedSharingUsersSelector = (
  state: State,
  params: SharingUserDataQueryRequest
) => {
  const querySelector = createQuerySelector(params.spaceId);
  const viewComposition = compose(viewListResults(listView), querySelector);
  return viewComposition(state, params.dataQuery);
};
export const createLiveSharingUsersSelector = (spaceId: string) => {
  const acceptedSharingUsersSelector =
    createAcceptedSharingUsersSelector(spaceId);
  return makeLiveSelectorGetter(
    acceptedSharingUsersSelector,
    () => listView,
    sharingUserMatchSelector,
    sharingUserMappersSelector
  );
};
export const sharingUserPermissionLevelSelector = (
  state: State,
  { itemId, userId }: SharingUserPermissionLevelRequest
): MemberPermission | undefined => {
  const itemGroup = itemItemGroupSelector(state, itemId);
  if (!itemGroup) {
    return undefined;
  }
  return getSharingUserPermission(itemGroup, userId);
};
export const getSharingUserPermissionLevelSelector = ({
  itemId,
  userId,
}: SharingUserPermissionLevelRequest) => {
  return (state: State) =>
    sharingUserPermissionLevelSelector(state, { itemId, userId });
};
