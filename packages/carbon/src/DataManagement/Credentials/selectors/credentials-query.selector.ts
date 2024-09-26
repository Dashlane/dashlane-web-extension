import { createSelector } from "reselect";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { filterTokenSelector } from "DataManagement/Credentials/selectors/filter-token.selector";
import { sortTokenSelector } from "DataManagement/Credentials/selectors/sort-token.selector";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { credentialMatcher } from "DataManagement/Credentials/search";
import { queryData } from "Libs/Query";
export const credentialsQuerySelector = createSelector(
  [
    fieldMappersSelector,
    sortTokenSelector,
    filterTokenSelector,
    credentialsSelector,
  ],
  (mappers, sortToken, filterToken, data) =>
    queryData(mappers, credentialMatcher, sortToken, filterToken, data)
);
