import { Credential } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isCredentialArray = (uut: unknown): uut is Credential[] =>
  isVaultItemArray(uut, VaultItemType.Credential);
