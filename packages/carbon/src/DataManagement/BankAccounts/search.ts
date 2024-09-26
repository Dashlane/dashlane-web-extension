import { BankAccount, Match } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
export const searchGetters: ((b: BankAccount) => string)[] = [
  stringProp<BankAccount>("BankAccountName"),
  stringProp<BankAccount>("BankAccountOwner"),
  stringProp<BankAccount>("BankAccountBank"),
];
export type BankAccountMatch = Match<BankAccount>;
export const bankAccountMatch: BankAccountMatch = match(searchGetters);
