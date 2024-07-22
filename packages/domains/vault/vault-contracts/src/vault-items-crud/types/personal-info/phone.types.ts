import { BaseItem } from "../common";
export enum PhoneType {
  Any = "ANY",
  Fax = "FAX",
  Landline = "LANDLINE",
  Mobile = "MOBILE",
  WorkFax = "WORKFAX",
  WorkLandline = "WORKLANDLINE",
  WorkMobile = "WORKMOBILE",
}
export interface Phone extends BaseItem {
  itemName: string;
  phoneNumber: string;
  numberInternational: string;
  numberNational: string;
  type: PhoneType;
}
