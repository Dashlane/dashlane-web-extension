import { createSelector } from "reselect";
import { userIdSelector } from "Session/selectors";
import { findMyAcceptedItemGroups } from "Sharing/2/Services/itemGroupHelpers";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
export const acceptedItemGroupsSelector = createSelector(
  sharingDataSelector,
  userIdSelector,
  ({ itemGroups, userGroups, collections }, userId) =>
    findMyAcceptedItemGroups(itemGroups, userGroups, collections, userId)
);
