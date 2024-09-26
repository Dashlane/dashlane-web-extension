import { defaultTo } from "ramda";
import { PaymentCardColor, PaymentCardType } from "@dashlane/communication";
export const defaultToEmptyString = defaultTo("");
export const defaultToFallbackColor = defaultTo(PaymentCardColor.BLUE_1);
export const defaultColor = "BLUE_1";
export function getLastDigitsFromCardNumber(cardNumber: string): string {
  const lastDigits = defaultToEmptyString(cardNumber).trim();
  return lastDigits.length >= 4 ? lastDigits.slice(-4) : "";
}
export function getPaymentTypeFromCardNumber(
  cardNumber: string
): PaymentCardType {
  if (!cardNumber) {
    return PaymentCardType.PAYMENT_TYPE_VISA;
  }
  const startsWithOneOf = (str: string, strArr: Array<string>) =>
    strArr.some((prefix) => str.startsWith(prefix));
  if (cardNumber.startsWith("4")) {
    return PaymentCardType.PAYMENT_TYPE_VISA;
  } else if (startsWithOneOf(cardNumber, ["34", "37"])) {
    return PaymentCardType.PAYMENT_TYPE_AMEX;
  } else if (
    startsWithOneOf(cardNumber, ["50", "51", "52", "53", "54", "55"])
  ) {
    return PaymentCardType.PAYMENT_TYPE_MASTERCARD;
  } else if (startsWithOneOf(cardNumber, ["6011", "65"])) {
    return PaymentCardType.PAYMENT_TYPE_DISCOVER;
  } else if (
    startsWithOneOf(cardNumber, [
      "300",
      "301",
      "302",
      "303",
      "304",
      "305",
      "36",
      "38",
    ])
  ) {
    return PaymentCardType.PAYMENT_TYPE_DINERSCLUB;
  } else if (startsWithOneOf(cardNumber, ["2123", "2131", "1800", "3"])) {
    return PaymentCardType.PAYMENT_TYPE_JCB;
  } else {
    return PaymentCardType.PAYMENT_TYPE_MASTERCARD;
  }
}
export class RequestError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "RequestError";
    this.code = code;
  }
}
