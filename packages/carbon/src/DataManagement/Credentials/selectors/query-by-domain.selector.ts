import { getQuerySelector } from "DataManagement/query-selector";
import { fieldMappersSelector } from "DataManagement/Credentials/selectors/field-mappers.selector";
import { credentialMatcher } from "DataManagement/Credentials/search";
import { getCredentialsByDomainSelector } from "DataManagement/Credentials/selectors/credentials-by-domain.selector";
export const getQueryByDomainSelector = (domain: string) =>
  getQuerySelector(
    getCredentialsByDomainSelector(domain),
    () => credentialMatcher,
    fieldMappersSelector
  );
