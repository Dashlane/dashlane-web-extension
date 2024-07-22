import { Secret } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isSecretArray = (uut: unknown): uut is Secret[] =>
  isVaultItemArray(uut, VaultItemType.Secret);
