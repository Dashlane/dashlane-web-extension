import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { listViewSelector } from "DataManagement/Credentials/selectors/list-view.selector";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialMatcher } from "DataManagement/Credentials/search";
export const getLiveCredentialsSelector = makeLiveSelectorGetter(
  credentialsSelector,
  listViewSelector,
  () => credentialMatcher,
  fieldMappersSelector
);
