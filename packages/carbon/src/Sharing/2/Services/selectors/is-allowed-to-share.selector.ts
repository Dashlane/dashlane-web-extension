import { createSelector } from "reselect";
import { sharingCapacitySelector } from "Sharing/2/Services/selectors/sharing-capacity.selector";
export const isAllowedToShareSelector = createSelector(
  sharingCapacitySelector,
  (remaining) => remaining.type === "unlimited" || remaining.remains > 0
);
