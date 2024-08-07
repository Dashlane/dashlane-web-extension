import { DriverLicenseAutofillView } from "@dashlane/autofill-contracts";
import { ParsedDate } from "../Dates/types";
export const getDriverLicenseParsedExpirationDate = (
  selectedVaultItem: DriverLicenseAutofillView
): ParsedDate => {
  return {
    day: String(selectedVaultItem.expirationDay),
    month: String(selectedVaultItem.expirationMonth),
    year: String(selectedVaultItem.expirationYear),
  };
};
export const getDriverLicenseParsedIssueDate = (
  selectedVaultItem: DriverLicenseAutofillView
): ParsedDate => {
  return {
    day: String(selectedVaultItem.issueDay),
    month: String(selectedVaultItem.issueMonth),
    year: String(selectedVaultItem.issueYear),
  };
};
