import { createSelector } from "reselect";
import { premiumStatusSelector } from "Session/selectors";
import { getSharingCapacity } from "Sharing/2/Services/sharing-capacity";
import { sharedItemsCountSelector } from "Sharing/2/Services/selectors/shared-items-count.selector";
export const sharingCapacitySelector = createSelector(
  sharedItemsCountSelector,
  premiumStatusSelector,
  getSharingCapacity
);
