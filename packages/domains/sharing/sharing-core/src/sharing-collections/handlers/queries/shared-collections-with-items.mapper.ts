import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import {
  ShareableCollectionSchema,
  SharedCollection,
} from "@dashlane/sharing-contracts";
import { Collection, VaultItemType } from "@dashlane/vault-contracts";
const toVaultItem = (itemGroup: ItemGroupDownload) => {
  if (!itemGroup.items || itemGroup.items.length !== 1) {
    throw new Error("Corrupted item group");
  }
  return {
    id: itemGroup.items[0].itemId,
    type: VaultItemType.Credential,
  };
};
const toCollectionWithVaultItems = (
  collection: SharedCollection,
  itemGroups: ItemGroupDownload[],
  teamId: string
): Collection & {
  isShared?: boolean;
} => ({
  name: collection.name,
  id: collection.uuid,
  spaceId: teamId,
  isShared: true,
  vaultItems: itemGroups
    .filter((x) => x.collections?.some((c) => c.uuid === collection.uuid))
    .map(toVaultItem),
});
export const toShareableCollection = (
  collection: SharedCollection,
  itemGroups: ItemGroupDownload[],
  teamId: string
) => {
  const sharedCollection = toCollectionWithVaultItems(
    collection,
    itemGroups,
    teamId
  );
  if (ShareableCollectionSchema.safeParse(sharedCollection).success) {
    return sharedCollection;
  }
  throw new Error("Failure to convert shared collection");
};
