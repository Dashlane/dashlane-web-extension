import { getQuerySelector } from "DataManagement/query-selector";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialMatcher } from "DataManagement/Credentials/search";
export const querySelector = getQuerySelector(
  credentialsSelector,
  () => credentialMatcher,
  fieldMappersSelector
);
