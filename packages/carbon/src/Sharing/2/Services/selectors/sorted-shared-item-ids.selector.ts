import { createSelector } from "reselect";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
export const sortedSharedItemIdsSelector = createSelector(
  sharingDataSelector,
  ({ items }) => items.map((i) => i.itemId).sort()
);
