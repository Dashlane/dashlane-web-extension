import {
  Match,
  SocialSecurityId,
  SocialSecurityIdWithIdentity,
} from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import { identityToName } from "DataManagement/Ids/helpers";
export const searchGetters: ((b: SocialSecurityIdWithIdentity) => string)[] = [
  stringProp<SocialSecurityId>("SocialSecurityNumber"),
  (socialSecurityId: SocialSecurityIdWithIdentity) =>
    identityToName(socialSecurityId.identity) ||
    socialSecurityId.SocialSecurityFullname,
];
export type SocialSecurityIdMatch = Match<SocialSecurityIdWithIdentity>;
export const socialSecurityIdMatch: SocialSecurityIdMatch =
  match(searchGetters);
