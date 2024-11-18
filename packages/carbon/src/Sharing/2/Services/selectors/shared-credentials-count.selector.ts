import { createSelector } from "reselect";
import { sortedSharedItemIdsSelector } from "Sharing/2/Services/selectors/sorted-shared-item-ids.selector";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { isShared } from "Sharing/2/Services/is-shared";
export const sharedCredentialsCountSelector = createSelector(
  sortedSharedItemIdsSelector,
  credentialsSelector,
  (sortedSharedItemIds, credentials) => {
    const predicate = isShared(sortedSharedItemIds);
    const sharedCredentials = credentials.filter(predicate);
    return sharedCredentials.length;
  }
);
