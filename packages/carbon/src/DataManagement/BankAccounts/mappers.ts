import { BankAccount } from "@dashlane/communication";
import { BankAccountMappers } from "DataManagement/BankAccounts/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
export const getBankAccountMappers = (): BankAccountMappers => ({
  spaceId: (p: BankAccount) => p.SpaceId,
  accountName: (p: BankAccount) => p.BankAccountName,
  bankName: (p: BankAccount) => p.BankAccountBank,
  lastUse: lastUseMapper,
  id: (p: BankAccount) => p.Id,
});
