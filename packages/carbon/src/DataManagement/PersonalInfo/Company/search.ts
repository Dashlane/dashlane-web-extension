import { Company } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((c: Company) => string)[] = [
  stringProp<Company>("JobTitle"),
  stringProp<Company>("Name"),
];
export const companyMatch = match(searchGetters);
