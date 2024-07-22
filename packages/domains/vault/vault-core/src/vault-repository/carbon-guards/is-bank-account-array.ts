import { BankAccount } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isBankAccountArray = (uut: unknown): uut is BankAccount[] =>
  isVaultItemArray(uut, VaultItemType.BankAccount);
