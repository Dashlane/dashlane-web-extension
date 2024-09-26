import { BankAccount, BankAccountUpdateModel } from "@dashlane/communication";
import {
  defaultToEmptyString,
  defaultToUS,
} from "DataManagement/BankAccounts/helpers";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { generateItemUuid } from "Utils/generateItemUuid";
export const getNewBankAccount = (
  newBankAccountData: BankAccountUpdateModel
): BankAccount => {
  const bankAccountCreationDate = getUnixTimestamp();
  return {
    kwType: "KWBankStatement",
    Id: generateItemUuid(),
    LastBackupTime: 0,
    LocaleFormat: defaultToUS(newBankAccountData.country),
    SpaceId: defaultToEmptyString(newBankAccountData.spaceId),
    CreationDatetime: bankAccountCreationDate,
    UserModificationDatetime: bankAccountCreationDate,
    BankAccountName: defaultToEmptyString(newBankAccountData.name),
    BankAccountOwner: defaultToEmptyString(newBankAccountData.owner),
    BankAccountIBAN: defaultToEmptyString(newBankAccountData.IBAN),
    BankAccountBIC: defaultToEmptyString(newBankAccountData.BIC),
    BankAccountBank: defaultToEmptyString(newBankAccountData.bank),
  };
};
