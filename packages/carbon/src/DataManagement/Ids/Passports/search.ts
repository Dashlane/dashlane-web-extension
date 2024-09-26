import { Match, Passport, PassportWithIdentity } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import { identityToName } from "DataManagement/Ids/helpers";
export const searchGetters: ((passport: PassportWithIdentity) => string)[] = [
  stringProp<Passport>("Number"),
  (passport: PassportWithIdentity) =>
    identityToName(passport.identity) || passport.Fullname,
];
export type PassportMatch = Match<PassportWithIdentity>;
export const passportMatch: PassportMatch = match(searchGetters);
