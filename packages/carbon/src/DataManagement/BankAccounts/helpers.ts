import { defaultTo } from "ramda";
import { BankAccount, BankData, Country } from "@dashlane/communication";
import { getBanks } from "StaticData/Banks";
export const defaultToEmptyString = defaultTo("");
export const defaultToUS = defaultTo(Country.US);
const getBankCode = (originalBankCode: string, countryBanks: BankData[]) => {
  if (countryBanks) {
    const [possibleBankCodeInName, bankCode] =
      defaultToEmptyString(originalBankCode).split("-");
    const possibleBankCode = countryBanks.find(({ code }) =>
      [possibleBankCodeInName, bankCode].includes(code)
    )?.code;
    return possibleBankCode || "NO_TYPE";
  }
  return "";
};
export const getBankInfoFromBankAccountData = (bankAccount: BankAccount) => {
  const bankCountry = defaultToUS(bankAccount.LocaleFormat);
  const { banks: countryBanks } = getBanks({ country: bankCountry });
  const bankCode = getBankCode(bankAccount.BankAccountBank, countryBanks);
  const bank = bankCode?.length > 0 ? `${bankCountry}-${bankCode}` : "";
  const bankLocalizedName = defaultToEmptyString(
    countryBanks?.find(({ code }) => code === bankCode)?.localizedString
  );
  return {
    country: bankCountry,
    bankCode: bankCode,
    bankLocalizedName: bankLocalizedName,
    bank,
  };
};
