import { Match, PersonalWebsite } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((p: PersonalWebsite) => string)[] = [
  stringProp<PersonalWebsite>("Name"),
  stringProp<PersonalWebsite>("Website"),
];
export type PersonalWebsiteMatch = Match<PersonalWebsite>;
export const personalWebsiteMatch: PersonalWebsiteMatch = match(searchGetters);
