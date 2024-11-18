import { createSelector } from "reselect";
import { sharedCredentialsCountSelector } from "Sharing/2/Services/selectors/shared-credentials-count.selector";
import { sharedNotesCountSelector } from "Sharing/2/Services/selectors/shared-notes-count.selector";
export const sharedItemsCountSelector = createSelector(
  sharedCredentialsCountSelector,
  sharedNotesCountSelector,
  (c, n) => c + n
);
