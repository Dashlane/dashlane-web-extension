import { CredentialWithCategory, Match } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import {
  getDashlaneDefinedLinkedWebsites,
  getUserAddedLinkedWebsitesRootDomains,
} from "DataManagement/LinkedWebsites";
const getSearchGetters: () => ((
  c: CredentialWithCategory
) => string)[] = () => {
  return [
    stringProp<CredentialWithCategory>("Email"),
    stringProp<CredentialWithCategory>("Login"),
    stringProp<CredentialWithCategory>("Title"),
    stringProp<CredentialWithCategory>("Note"),
    stringProp<CredentialWithCategory>("SecondaryLogin"),
    (c: CredentialWithCategory) =>
      getDashlaneDefinedLinkedWebsites(c.Url).join(" "),
    (c: CredentialWithCategory) =>
      getUserAddedLinkedWebsitesRootDomains(c).join(" "),
  ];
};
export type CredentialMatch = Match<CredentialWithCategory>;
export const credentialMatcher: CredentialMatch = match(getSearchGetters());
