import { BankAccountFormFields } from './bank-account-form';
type ValidationReturn = {
    isValid: false;
    errorSet: Set<keyof BankAccountFormFields>;
} | {
    isValid: true;
};
export const validateBankAccountForm = (bankAccountContent: Partial<BankAccountFormFields>): ValidationReturn => {
    if (!bankAccountContent.BIC && !bankAccountContent.IBAN) {
        return { isValid: false, errorSet: new Set(['BIC', 'IBAN']) };
    }
    return { isValid: true };
};
