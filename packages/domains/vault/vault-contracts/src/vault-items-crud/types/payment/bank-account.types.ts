import { BaseItem, Country } from "../common";
export interface BankAccount extends BaseItem {
  accountName: string;
  bankCode: string;
  BIC: string;
  country: Country;
  IBAN: string;
  ownerName: string;
}
