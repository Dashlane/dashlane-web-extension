import { stringProp } from "DataManagement/Search/utils";
import { Address } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
export const searchGetters: ((a: Address) => string)[] = [
  stringProp<Address>("AddressFull"),
  stringProp<Address>("AddressName"),
  stringProp<Address>("City"),
  stringProp<Address>("Receiver"),
  stringProp<Address>("StreetNumber"),
  stringProp<Address>("ZipCode"),
];
export const addressMatch = match(searchGetters);
