import { createSelector } from "reselect";
import { getLimitedSharedItemIds } from "Sharing/2/Services/limited-shared-items";
import { userIdSelector } from "Session/selectors";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import {
  sharedCollectionItemsSelector,
  sharedCollectionsSelector,
} from "./shared-collections.selector";
export const limitedSharingItemsSelector = createSelector(
  sharingDataSelector,
  sharedCollectionsSelector,
  sharedCollectionItemsSelector,
  userIdSelector,
  getLimitedSharedItemIds
);
