import { createSelector } from "reselect";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { credentialMatcher } from "DataManagement/Credentials/search";
import { countCredentials } from "DataManagement/Credentials/count-credentials";
import { filterTokenSelector } from "DataManagement/Credentials/selectors/filter-token.selector";
export const credentialsCountSelector = createSelector(
  [fieldMappersSelector, filterTokenSelector, credentialsSelector],
  (mappers, filterToken, credentials) =>
    countCredentials(mappers, credentialMatcher, filterToken, credentials)
);
