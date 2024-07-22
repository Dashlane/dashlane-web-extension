import { BaseItem } from "../common";
export enum PaymentCardColorType {
  Black = "BLACK",
  Blue1 = "BLUE1",
  Blue2 = "BLUE2",
  Gold = "GOLD",
  Green1 = "GREEN1",
  Green2 = "GREEN2",
  Orange = "ORANGE",
  Red = "RED",
  Silver = "SILVER",
  White = "WHITE",
}
export interface PaymentCard extends BaseItem {
  cardNumber: string;
  color: PaymentCardColorType;
  expireMonth: string;
  expireYear: string;
  itemName: string;
  note: string;
  ownerName: string;
  securityCode: string;
}
