import { Country } from "../../DataModel";
import { SaveBankAccountFromUI } from "../../Save";
import { DataQuery } from "../types";
export type BankAccountFilterField = "id" | "spaceId";
export type BankAccountSortField =
  | "accountName"
  | "bankName"
  | "id"
  | "lastUse";
export type BankAccountDataQuery = DataQuery<
  BankAccountSortField,
  BankAccountFilterField
>;
export interface BankAccountUpdateModel {
  name: string;
  owner: string;
  IBAN: string;
  BIC: string;
  bank: string;
  country: Country;
  spaceId: string;
}
export type SaveBankAccount = SaveBankAccountFromUI;
