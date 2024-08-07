import { VaultSourceType } from "@dashlane/autofill-contracts";
import { CapturedValuesAndProperties } from "../../../../modules/dataCapture/personal-data-capture-helpers";
export const NBSP = "\u00A0";
export const formatOwnerNameFromCapturedData = (
  capturedData: CapturedValuesAndProperties<VaultSourceType.PaymentCard>
): string =>
  capturedData
    .reduce((acc, captureField) => {
      if (captureField.value && captureField.property === "ownerName") {
        return `${acc} ${captureField.value}`;
      }
      return acc;
    }, "")
    .trim();
const isVisaCard = (cardNumber: string): boolean => cardNumber.length === 13;
const isDinersClubCard = (cardNumber: string): boolean =>
  cardNumber.length === 14;
const isAmexCard = (cardNumber: string): boolean => cardNumber.length === 15;
const isMasterCard = (cardNumber: string): boolean => cardNumber.length === 16;
export const isValidCardNumberLength = (cardNumber: string): boolean => {
  return (
    isVisaCard(cardNumber) ||
    isDinersClubCard(cardNumber) ||
    isAmexCard(cardNumber) ||
    isMasterCard(cardNumber)
  );
};
export const getFormattedLastDigits = (
  lastDigits: string,
  size: "long" | "short"
) =>
  size === "long"
    ? `••••${NBSP}••••${NBSP}••••${NBSP}${lastDigits}`
    : `••••${NBSP}${lastDigits}`;
export const getFormattedExpirationDate = (
  expirationMonth: string,
  expirationYear: string
) => {
  return expirationMonth && expirationYear
    ? `${expirationMonth.padStart(2, "0")}/${expirationYear.slice(-2)}`
    : "";
};
