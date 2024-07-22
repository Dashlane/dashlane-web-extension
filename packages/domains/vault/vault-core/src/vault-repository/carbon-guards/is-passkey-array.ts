import { Passkey } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isPasskeyArray = (uut: unknown): uut is Passkey[] =>
  isVaultItemArray(uut, VaultItemType.Passkey);
