import { createSelector } from "reselect";
import { getCredentialMappers } from "DataManagement/Credentials/mappers";
import { credentialDisplayTitlesSelector } from "DataManagement/Credentials/selectors/credentials-display-titles.selector";
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
export const fieldMappersSelector = createSelector(
  limitedSharingItemsSelector,
  credentialDisplayTitlesSelector,
  getCredentialMappers
);
