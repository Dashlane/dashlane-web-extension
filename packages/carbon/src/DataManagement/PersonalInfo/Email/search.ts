import { Email } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((e: Email) => string)[] = [
  stringProp<Email>("Email"),
  stringProp<Email>("EmailName"),
];
export const emailMatch = match(searchGetters);
