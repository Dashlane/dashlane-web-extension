import { CoreServices } from "Services";
import { duplicateSharedElements } from ".";
import { DuplicateVaultItemRequest } from "@dashlane/communication";
export const duplicateVaultItemHandler = async (
  { storeService }: CoreServices,
  { vaultItemId }: DuplicateVaultItemRequest
) => {
  return {
    newVaultItemId: await duplicateSharedElements(storeService, vaultItemId),
  };
};
