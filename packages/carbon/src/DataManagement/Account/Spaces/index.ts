import { Credential, Space } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { getUserAddedLinkedWebsiteDomains } from "DataManagement/LinkedWebsites";
export function isSpaceQuarantined(space: Space) {
  if (!space) {
    return false;
  }
  const revokedSpace = space.details.status.toLowerCase() !== "accepted";
  if (!revokedSpace || !space.details.info) {
    return false;
  }
  return (
    Boolean(space.details.info["forcedDomainsEnabled"]) &&
    Boolean(space.details.info["removeForcedContentEnabled"])
  );
}
export function isCredentialSmartCategorized(
  credential: Credential,
  teamDomains: string[]
) {
  if (!credential) {
    return false;
  }
  let credentialUrl = "";
  if (credential.Url) {
    const domainForUrl = new ParsedURL(credential.Url).getRootDomain();
    credentialUrl = domainForUrl ? domainForUrl.toLowerCase() : "";
  }
  const credentialEmail = credential.Email
    ? credential.Email.toLowerCase()
    : "";
  const credentialLogin = credential.Login
    ? credential.Login.toLowerCase()
    : "";
  const credentialSecondaryLogin = credential.SecondaryLogin
    ? credential.SecondaryLogin.toLowerCase()
    : "";
  const credentialUserAddedLinkedWebsiteDomains =
    getUserAddedLinkedWebsiteDomains(credential).map((domain) =>
      domain.toLowerCase()
    );
  return (
    teamDomains.filter((domain: string) => {
      const lowerCaseDomain = domain.toLowerCase();
      return (
        credentialUrl.includes(lowerCaseDomain) ||
        credentialEmail.includes(lowerCaseDomain) ||
        credentialLogin.includes(lowerCaseDomain) ||
        credentialSecondaryLogin.includes(lowerCaseDomain) ||
        credentialUserAddedLinkedWebsiteDomains.some((domain) =>
          domain.includes(lowerCaseDomain)
        )
      );
    }).length > 0
  );
}
