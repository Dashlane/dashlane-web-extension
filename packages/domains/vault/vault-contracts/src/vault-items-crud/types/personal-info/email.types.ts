import { BaseItem } from "../common";
export enum EmailType {
  Perso = "PERSO",
  Pro = "PRO",
  NoType = "NO_TYPE",
}
export interface Email extends BaseItem {
  itemName: string;
  emailAddress: string;
  type: EmailType;
}
