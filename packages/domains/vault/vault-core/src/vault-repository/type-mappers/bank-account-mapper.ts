import { BankAccount as CarbonBankAccount } from "@dashlane/communication";
import { BankAccount } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const bankAccountMapper = (
  carbonBankAccount: CarbonBankAccount
): BankAccount => {
  const {
    BankAccountName,
    BankAccountOwner,
    BankAccountIBAN,
    BankAccountBIC,
    BankAccountBank,
    ...rest
  } = carbonBankAccount;
  const bankAccountBankProperties = BankAccountBank?.split("-");
  const bankAccountCode =
    bankAccountBankProperties?.length > 1
      ? bankAccountBankProperties[1] ?? BankAccountBank
      : BankAccountBank;
  return {
    ...mapKeysToLowercase(rest),
    accountName: BankAccountName,
    bankCode: bankAccountCode || "",
    BIC: BankAccountBIC,
    country: rest.LocaleFormat,
    IBAN: BankAccountIBAN,
    ownerName: BankAccountOwner,
  };
};
