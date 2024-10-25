import { createSelector } from "reselect";
import { ItemGroupDownload } from "@dashlane/sharing";
import { State } from "Store";
import { findMyAcceptedUserGroups } from "Sharing/2/Services/SharingHelpers";
import { loginStatusSelector } from "Session/LoginStatus";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import { findItemItemGroup } from "Sharing/2/Services/itemGroupHelpers";
export const isSharedSelector = (state: State, itemId: string): boolean => {
  const { items } = sharingDataSelector(state);
  return items.some((i) => i.itemId === itemId);
};
export const itemItemGroupSelector = (
  state: State,
  itemId: string
): ItemGroupDownload | undefined => {
  const { itemGroups } = sharingDataSelector(state);
  return findItemItemGroup(itemId, itemGroups);
};
export const myAcceptedUserGroupsSelector = createSelector(
  loginStatusSelector,
  sharingDataSelector,
  ({ login }, { userGroups }) => findMyAcceptedUserGroups(userGroups, login)
);
