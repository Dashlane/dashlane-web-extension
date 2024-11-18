import {
  ShareableCollectionSchema,
  SharedCollection,
  SharedItem,
} from "@dashlane/sharing-contracts";
import { Collection, VaultItemType } from "@dashlane/vault-contracts";
const toVaultItem = (sharedItem: SharedItem) => {
  if (!sharedItem.itemId || !sharedItem.sharedItemId) {
    throw new Error("Corrupted item group");
  }
  return {
    id: sharedItem.itemId,
    type: VaultItemType.Credential,
  };
};
const toCollectionWithVaultItems = (
  collection: SharedCollection,
  sharedItems: SharedItem[],
  teamId: string
): Collection & {
  isShared?: boolean;
} => ({
  name: collection.name,
  id: collection.uuid,
  spaceId: teamId,
  isShared: true,
  vaultItems: sharedItems
    .filter((sharedItem) =>
      sharedItem.recipientIds.collectionIds?.some(
        (collectionId) => collectionId === collection.uuid
      )
    )
    .map(toVaultItem),
});
export const toShareableCollection = (
  collection: SharedCollection,
  sharedItems: SharedItem[],
  teamId: string
) => {
  const sharedCollection = toCollectionWithVaultItems(
    collection,
    sharedItems,
    teamId
  );
  if (ShareableCollectionSchema.safeParse(sharedCollection).success) {
    return sharedCollection;
  }
  throw new Error("Failure to convert shared collection");
};
