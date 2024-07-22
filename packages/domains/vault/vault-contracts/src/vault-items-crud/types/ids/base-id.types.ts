import { BaseItem, Country } from "../common";
export interface BaseId extends BaseItem {
  idName: string;
  idNumber: string;
  country: Country;
  linkedIdentity?: string;
}
export interface BaseIdWithExpiration extends BaseId {
  issueDate: string;
  expirationDate: string;
}
