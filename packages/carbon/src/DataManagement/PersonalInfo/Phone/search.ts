import { Phone } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((p: Phone) => string)[] = [
  stringProp<Phone>("Number"),
  stringProp<Phone>("PhoneName"),
];
export const phoneMatch = match(searchGetters);
