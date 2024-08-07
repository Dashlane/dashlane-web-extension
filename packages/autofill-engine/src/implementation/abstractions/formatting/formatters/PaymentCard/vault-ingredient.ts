import { PaymentCardAutofillView } from "@dashlane/autofill-contracts";
import { FieldFormat } from "../../../../../types";
import { formatDate, getDateFormat, getDateSeparator } from "../Dates/helpers";
import { DateFormat, DateSeparator, ParsedDate } from "../Dates/types";
export const getParsedExpirationDate = (
  selectedVaultItem: PaymentCardAutofillView
): ParsedDate => {
  return {
    month: selectedVaultItem.expireMonth,
    year: selectedVaultItem.expireYear,
  };
};
export const formatExpirationDate = (
  selectedVaultItem: PaymentCardAutofillView,
  fieldFormat?: FieldFormat
): string => {
  const parsedDate = getParsedExpirationDate(selectedVaultItem);
  return formatDate(
    getDateFormat(fieldFormat?.dateFormat, DateFormat.FORMAT_MM_YY),
    getDateSeparator(fieldFormat?.dateSeparator, DateSeparator.SEPARATOR_SLASH),
    parsedDate
  );
};
export const formatExpirationMonth = (
  selectedVaultItem: PaymentCardAutofillView,
  fieldFormat?: FieldFormat
): string =>
  formatExpirationDate(selectedVaultItem, {
    dateFormat: fieldFormat?.dateFormat ?? DateFormat.FORMAT_MM,
    dateSeparator: DateSeparator.SEPARATOR_NOTHING,
  });
export const formatCardNumber = (
  selectedVaultItem: PaymentCardAutofillView,
  fieldFormat?: FieldFormat
): string => {
  const { cardNumber } = selectedVaultItem;
  if (typeof fieldFormat?.partNumber === "number") {
    const partLength = 4;
    return cardNumber.substr(fieldFormat.partNumber * partLength, partLength);
  }
  return cardNumber;
};
