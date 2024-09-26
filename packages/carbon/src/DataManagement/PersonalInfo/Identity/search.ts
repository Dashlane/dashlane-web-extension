import { Identity } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((i: Identity) => string)[] = [
  stringProp<Identity>("BirthDate"),
  stringProp<Identity>("BirthPlace"),
  stringProp<Identity>("FirstName"),
  stringProp<Identity>("LastName"),
  stringProp<Identity>("LastName2"),
  stringProp<Identity>("MiddleName"),
  stringProp<Identity>("Pseudo"),
];
export const identityMatch = match(searchGetters);
