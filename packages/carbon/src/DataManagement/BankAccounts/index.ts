import { Diff } from "utility-types";
import { defaultTo } from "ramda";
import {
  BankAccount,
  BaseSaveBankAccountContent,
  DataModelObject,
  SaveBankAccount,
} from "@dashlane/communication";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import {
  makeNewPersonalDataItemBase,
  makeUpdatedPersonalDataItemBase,
} from "DataManagement/helpers";
export async function makeUpdatedBankAccount(
  updatedItem: SaveBankAccount,
  existingItem: BankAccount
): Promise<BankAccount> {
  const baseItem = makeUpdatedPersonalDataItemBase({
    existingItem,
    updatedItem,
    itemUpdateDate: getUnixTimestamp(),
  });
  return {
    ...existingItem,
    ...baseItem,
    ...makeBankAccountSpecificProps(updatedItem.content),
  };
}
export async function makeNewBankAccount(
  newItem: SaveBankAccount
): Promise<BankAccount> {
  return {
    ...makeNewPersonalDataItemBase(newItem),
    ...makeBankAccountSpecificProps(newItem.content),
  };
}
export type MakeBankAccountSpecificResult = Diff<BankAccount, DataModelObject>;
export function makeBankAccountSpecificProps(
  item: Partial<BaseSaveBankAccountContent>
): MakeBankAccountSpecificResult {
  const defaultToEmptyString = defaultTo("");
  return {
    BankAccountName: defaultToEmptyString(item.name),
    BankAccountOwner: defaultToEmptyString(item.owner),
    BankAccountIBAN: defaultToEmptyString(item.IBAN),
    BankAccountBIC: defaultToEmptyString(item.BIC),
    BankAccountBank: defaultToEmptyString(item.bank),
  };
}
