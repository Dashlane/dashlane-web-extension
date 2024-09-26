import { BankAccount, PaymentCard } from "@dashlane/communication";
import { handleSpecialCharacter } from "./handle-special-character";
import { formatDataToCSV, formatHeader } from "./helpers";
import { PersonalDataVaultItems } from "DataManagement/types";
export function getPaymentsExport(
  personalData: PersonalDataVaultItems
): string {
  const bankAccountsData = personalData.bankAccounts;
  const paymentCardsData = personalData.paymentCards;
  const metaData = [
    { headerKey: "type", dataKey: "Type" },
    { headerKey: "account_name", dataKey: "BankAccountName" },
    { headerKey: "account_holder", dataKey: "BankAccountOwner" },
    { headerKey: "cc_number", dataKey: "CardNumber" },
    { headerKey: "code", dataKey: "SecurityCode" },
    { headerKey: "expiration_month", dataKey: "ExpireMonth" },
    { headerKey: "expiration_year", dataKey: "ExpireYear" },
    { headerKey: "routing_number", dataKey: "BankAccountBIC" },
    { headerKey: "account_number", dataKey: "BankAccountIBAN" },
    { headerKey: "country", dataKey: "LocaleFormat" },
    { headerKey: "issuing_bank", dataKey: "BankAccountBank" },
    { headerKey: "note", dataKey: "CCNote" },
    { headerKey: "name", dataKey: "Name" },
  ];
  const filterBankAccountsData = (bankAccounts: BankAccount[]) => {
    return bankAccounts.map((account) => {
      return metaData
        .map((data) => {
          const filteredValue = `${account[data.dataKey] ?? ""}`;
          if (data.dataKey === "Type") {
            return handleSpecialCharacter("bank");
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatBankAccountsData = (bankAccounts: BankAccount[]): string => {
    return filterBankAccountsData(bankAccounts).join("\r\n");
  };
  const filterPaymentCardsData = (paymentCards: PaymentCard[]) => {
    return paymentCards.map((card) => {
      return metaData
        .map((data) => {
          const filteredValue = `${card[data.dataKey] ?? ""}`;
          if (data.dataKey === "Type") {
            return handleSpecialCharacter("payment_card");
          } else if (data.dataKey === "BankAccountName") {
            const cardOwnerName = card["OwnerName"];
            return handleSpecialCharacter(cardOwnerName);
          } else {
            return handleSpecialCharacter(filteredValue);
          }
        })
        .join(",");
    });
  };
  const formatPaymentCardsData = (paymentCards: PaymentCard[]): string => {
    return filterPaymentCardsData(paymentCards).join("\r\n");
  };
  return formatDataToCSV([
    formatHeader(metaData),
    formatBankAccountsData(bankAccountsData),
    formatPaymentCardsData(paymentCardsData),
  ]);
}
