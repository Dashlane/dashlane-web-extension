import {
  BankAccount,
  BankAccountFilterField,
  BankAccountSortField,
  Mappers,
} from "@dashlane/communication";
export type BankAccountMappers = Mappers<
  BankAccount,
  BankAccountSortField,
  BankAccountFilterField
>;
