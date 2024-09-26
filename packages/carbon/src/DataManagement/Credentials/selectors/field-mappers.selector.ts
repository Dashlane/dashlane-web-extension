import { createSelector } from "reselect";
import { getCredentialMappers } from "DataManagement/Credentials/mappers";
import { credentialCategoriesSelector } from "DataManagement/Credentials/selectors/credential-categories.selector";
import { credentialDisplayTitlesSelector } from "DataManagement/Credentials/selectors/credentials-display-titles.selector";
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
export const fieldMappersSelector = createSelector(
  credentialCategoriesSelector,
  limitedSharingItemsSelector,
  credentialDisplayTitlesSelector,
  getCredentialMappers
);
