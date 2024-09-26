import { IdCard, IdCardWithIdentity, Match } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
import { identityToName } from "DataManagement/Ids/helpers";
export const searchGetters: ((idCard: IdCardWithIdentity) => string)[] = [
  stringProp<IdCard>("Number"),
  (idCard: IdCardWithIdentity) =>
    identityToName(idCard.identity) || idCard.Fullname,
];
export type IdCardMatch = Match<IdCardWithIdentity>;
export const idCardMatch: IdCardMatch = match(searchGetters);
