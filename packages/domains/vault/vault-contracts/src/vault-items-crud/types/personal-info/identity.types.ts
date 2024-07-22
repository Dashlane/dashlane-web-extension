import { BaseItem } from "../common";
export enum IdentityTitle {
  Mr = "MR",
  Mrs = "MRS",
  Miss = "MISS",
  Ms = "MS",
  Mx = "MX",
  NoneOfThese = "NONEOFTHESE",
}
export interface Identity extends BaseItem {
  firstName: string;
  middleName: string;
  lastName: string;
  lastName2: string;
  pseudo: string;
  birthDate: string;
  birthPlace: string;
  title?: IdentityTitle;
}
