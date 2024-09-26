import { GeneratedPassword, Match } from "@dashlane/communication";
import { stringProp } from "DataManagement/Search/utils";
import { match } from "DataManagement/Search/match";
export const searchGetters: ((g: GeneratedPassword) => string)[] = [
  stringProp<GeneratedPassword>("Domain"),
];
export type GeneratedPasswordMatch = Match<GeneratedPassword>;
export const generatedPasswordMatch: GeneratedPasswordMatch =
  match(searchGetters);
