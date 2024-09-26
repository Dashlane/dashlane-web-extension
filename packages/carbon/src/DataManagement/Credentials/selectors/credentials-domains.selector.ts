import { createSelector } from "reselect";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
export const credentialsDomainsSelector = createSelector(
  credentialsSelector,
  (credentials) =>
    credentials.reduce((domainSet, credential) => {
      const domain = getDomainForCredential(credential);
      if (domain) {
        domainSet.add(domain);
      }
      return domainSet;
    }, new Set<string>())
);
