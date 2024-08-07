import { IdCardAutofillView } from "@dashlane/autofill-contracts";
import { ParsedDate } from "../Dates/types";
export const getIdCardParsedExpirationDate = (
  selectedVaultItem: IdCardAutofillView
): ParsedDate => {
  return {
    day: String(selectedVaultItem.issueDay),
    month: String(selectedVaultItem.issueMonth),
    year: String(selectedVaultItem.issueYear),
  };
};
export const getIdCardParsedIssueDate = (
  selectedVaultItem: IdCardAutofillView
): ParsedDate => {
  return {
    day: String(selectedVaultItem.issueDay),
    month: String(selectedVaultItem.issueMonth),
    year: String(selectedVaultItem.issueYear),
  };
};
