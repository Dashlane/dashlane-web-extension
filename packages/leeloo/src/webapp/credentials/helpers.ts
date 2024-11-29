import { PremiumStatusSpace } from "@dashlane/communication";
import { Credential } from "@dashlane/vault-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { CredentialTabs } from "./edit/types";
type TabSearchParamsAccepted =
  | "account-details"
  | "shared-access"
  | "linked-websites";
export const SEARCH_PARAMS_TO_CREDENTIAL_TAB_MAP: Record<
  TabSearchParamsAccepted,
  CredentialTabs
> = {
  "account-details": CredentialTabs.ACCOUNT_DETAILS,
  "shared-access": CredentialTabs.SHARED_ACCESS,
  "linked-websites": CredentialTabs.LINKED_WEBSITES,
};
const isCredentialSmartCategorized = (
  credential: Credential,
  teamDomains: string[]
) => {
  let URL = "";
  if (credential.URL) {
    URL = new ParsedURL(credential.URL).getRootDomain()?.toLowerCase() ?? "";
  }
  const email = credential.email?.toLowerCase() ?? "";
  const username = credential.username?.toLowerCase() ?? "";
  const alternativeUsername =
    credential.alternativeUsername?.toLowerCase() ?? "";
  const linkedURLs = credential.linkedURLs.map((linkedURL) =>
    linkedURL.toLowerCase()
  );
  return teamDomains.some((domain: string) => {
    const lowerCaseDomain = domain.toLowerCase();
    return (
      URL.includes(lowerCaseDomain) ||
      email.includes(lowerCaseDomain) ||
      username.includes(lowerCaseDomain) ||
      alternativeUsername.includes(lowerCaseDomain) ||
      linkedURLs.some((linkedURL) => linkedURL.includes(lowerCaseDomain))
    );
  });
};
export const getCredentialForceCategorizedSpace = (
  credential: Credential,
  spaces: PremiumStatusSpace[]
) => {
  const activeSpaceWithForceCategorization = spaces.find(
    (space) => space.status === "accepted" && space.info?.forcedDomainsEnabled
  );
  if (
    activeSpaceWithForceCategorization &&
    isCredentialSmartCategorized(
      credential,
      activeSpaceWithForceCategorization.info?.teamDomains ?? []
    )
  ) {
    return activeSpaceWithForceCategorization;
  }
  return null;
};
