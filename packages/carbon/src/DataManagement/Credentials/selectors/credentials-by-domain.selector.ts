import { createSelector } from "reselect";
import { Credential } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import {
  getDashlaneDefinedLinkedWebsites,
  getUserAddedLinkedWebsitesRootDomains,
} from "DataManagement/LinkedWebsites";
export enum DomainMatchType {
  MainWebsite = "MainWebsite",
  DashlaneDefinedLinkedWebsite = "DashlaneDefinedLinkedWebsite",
  UserDefinedLinkedWebsite = "UserDefinedLinkedWebsite",
  None = "None",
}
export const getCredentialByDomainMatchType = (
  domain: string,
  credential: Credential
): DomainMatchType => {
  if (!domain) {
    return DomainMatchType.None;
  }
  const mainWebsiteRootDomain = new ParsedURL(credential.Url).getRootDomain();
  if (domain === mainWebsiteRootDomain) {
    return DomainMatchType.MainWebsite;
  }
  if (getDashlaneDefinedLinkedWebsites(credential.Url).includes(domain)) {
    return DomainMatchType.DashlaneDefinedLinkedWebsite;
  }
  if (getUserAddedLinkedWebsitesRootDomains(credential).includes(domain)) {
    return DomainMatchType.UserDefinedLinkedWebsite;
  }
  return DomainMatchType.None;
};
const filterCredentialsByDomain = (
  credentials: Credential[],
  domain: string
) => {
  return credentials.filter((credential) => {
    const matchType = getCredentialByDomainMatchType(domain, credential);
    const acceptedMatchTypes = [
      DomainMatchType.MainWebsite,
      DomainMatchType.DashlaneDefinedLinkedWebsite,
      DomainMatchType.UserDefinedLinkedWebsite,
    ];
    return acceptedMatchTypes.includes(matchType);
  });
};
export const getCredentialsByDomainSelector = (domain: string) =>
  createSelector(credentialsSelector, (credentials) =>
    filterCredentialsByDomain(credentials, domain)
  );
