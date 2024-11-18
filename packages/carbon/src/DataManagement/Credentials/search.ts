import { Credential, Match } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import {
  getDashlaneDefinedLinkedWebsites,
  getUserAddedLinkedWebsitesRootDomains,
} from "DataManagement/LinkedWebsites";
const getSearchGetters: () => ((c: Credential) => string)[] = () => {
  return [
    stringProp<Credential>("Email"),
    stringProp<Credential>("Login"),
    stringProp<Credential>("Title"),
    stringProp<Credential>("Note"),
    stringProp<Credential>("SecondaryLogin"),
    (c: Credential) => getDashlaneDefinedLinkedWebsites(c.Url).join(" "),
    (c: Credential) => getUserAddedLinkedWebsitesRootDomains(c).join(" "),
  ];
};
export type CredentialMatch = Match<Credential>;
export const credentialMatcher: CredentialMatch = match(getSearchGetters());
