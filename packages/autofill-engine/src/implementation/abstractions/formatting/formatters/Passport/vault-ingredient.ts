import { PassportAutofillView } from "@dashlane/autofill-contracts";
import { ParsedDate } from "../Dates/types";
import { formatPassportDate } from "./helpers";
export const getPassportParsedExpirationDate = (
  selectedVaultItem: PassportAutofillView
): ParsedDate => {
  return {
    day: String(selectedVaultItem.issueDay),
    month: String(selectedVaultItem.issueMonth),
    year: String(selectedVaultItem.issueYear),
  };
};
export const getPassportParsedIssueDate = (
  selectedVaultItem: PassportAutofillView
): ParsedDate => {
  return {
    day: String(selectedVaultItem.issueDay),
    month: String(selectedVaultItem.issueMonth),
    year: String(selectedVaultItem.issueYear),
  };
};
export const formatPassportExpirationDay = (
  item: PassportAutofillView
): string => {
  return formatPassportDate(item, "expirationDay");
};
export const formatPassportExpirationMonth = (
  item: PassportAutofillView
): string => {
  return formatPassportDate(item, "expirationMonth");
};
export const formatPassportIssueDay = (item: PassportAutofillView): string => {
  return formatPassportDate(item, "issueDay");
};
export const formatPassportIssueMonth = (
  item: PassportAutofillView
): string => {
  return formatPassportDate(item, "issueMonth");
};
