import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { listViewSelector } from "DataManagement/Credentials/selectors/list-view.selector";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialMatcher } from "DataManagement/Credentials/search";
import { getCredentialsByDomainSelector } from "DataManagement/Credentials/selectors/credentials-by-domain.selector";
export const getLiveCredentialsByDomainSelector = (domain: string) =>
  makeLiveSelectorGetter(
    getCredentialsByDomainSelector(domain),
    listViewSelector,
    () => credentialMatcher,
    fieldMappersSelector
  );
