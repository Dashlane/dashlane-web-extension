import { BankAccountFormFields } from "./bank-account-form";
type ValidationReturn =
  | {
      isValid: false;
      errorSet: Set<keyof BankAccountFormFields>;
    }
  | {
      isValid: true;
    };
export const validateBankAccountForm = (
  bankAccountContent: Partial<BankAccountFormFields>
): ValidationReturn => {
  if (!bankAccountContent.IBAN || bankAccountContent.IBAN.length === 0) {
    return { isValid: false, errorSet: new Set(["IBAN"]) };
  }
  return { isValid: true };
};
