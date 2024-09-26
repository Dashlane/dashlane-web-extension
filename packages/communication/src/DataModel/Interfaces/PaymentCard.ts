import { Enum } from "typescript-string-enums";
import * as Common from "./Common";
export const PaymentCardType = Enum(
  "PAYMENT_TYPE_VISA",
  "PAYMENT_TYPE_MASTERCARD",
  "PAYMENT_TYPE_AMEX",
  "PAYMENT_TYPE_DISCOVER",
  "PAYMENT_TYPE_JCB",
  "PAYMENT_TYPE_DINERSCLUB"
);
export type PaymentCardType = Enum<typeof PaymentCardType>;
export const PaymentCardColor = Enum(
  "BLACK",
  "SILVER",
  "WHITE",
  "RED",
  "ORANGE",
  "GOLD",
  "BLUE_1",
  "BLUE_2",
  "GREEN_1",
  "GREEN_2"
);
export type PaymentCardColor = Enum<typeof PaymentCardColor>;
export interface PaymentCard extends Common.DataModelObject {
  Name: string;
  CardNumber: string;
  CardNumberLastDigits: string;
  OwnerName: string;
  SecurityCode: string;
  ExpireMonth: string;
  ExpireYear: string;
  StartMonth: string;
  StartYear: string;
  IssueNumber: string;
  Color: PaymentCardColor;
  Bank: string;
  CCNote: string;
  Type: PaymentCardType;
}
export interface UpdatePaymentCardToken {
  tokenId: string;
  stripeAccount: string;
}
export interface UpdatePaymentCardTokenResult {
  success: boolean;
  reason?: string;
}
export function isPaymentCard(o: Common.BaseDataModelObject): o is PaymentCard {
  return Boolean(o) && o.kwType === "KWPaymentMean_creditCard";
}
