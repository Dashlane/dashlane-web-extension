import * as Common from "./Common";
export interface BankAccount extends Common.DataModelObject {
  BankAccountName: string;
  BankAccountOwner: string;
  BankAccountIBAN: string;
  BankAccountBIC: string;
  BankAccountBank: string;
}
export function isBankAccount(o: Common.BaseDataModelObject): o is BankAccount {
  return Boolean(o) && o.kwType === "KWBankStatement";
}
