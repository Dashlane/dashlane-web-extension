import { BaseDataModelObject } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
export function isVaultItemArray<T extends BaseDataModelObject>(
  uut: unknown,
  vaultItemType: VaultItemType
): uut is T[] {
  if (!Array.isArray(uut)) {
    return false;
  }
  if (uut.length === 0) {
    return true;
  }
  const item = uut[0] as Partial<T>;
  return item.kwType === vaultItemType;
}
