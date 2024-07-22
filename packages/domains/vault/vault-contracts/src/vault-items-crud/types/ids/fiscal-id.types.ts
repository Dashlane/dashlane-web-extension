import { BaseItem, Country } from "../common";
export interface FiscalId extends BaseItem {
  fiscalNumber: string;
  teledeclarantNumber: string;
  country: Country;
}
