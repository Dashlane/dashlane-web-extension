import { Collection } from "@dashlane/communication";
import { SharedCollection } from "Sharing/2/Services/collection-helpers";
export const getCollectionNamesContainingVaultItemId = (
  vaultItemId: string,
  collections: Collection[],
  sharedCollections: SharedCollection[] = []
) =>
  collections
    .flatMap((collection) => {
      return collection.VaultItems.some(
        (vaultItem) => vaultItem.Id === vaultItemId
      )
        ? collection.Name
        : [];
    })
    .concat(
      sharedCollections.flatMap((collection) => {
        return collection.vaultItems.some(
          (vaultItem) => vaultItem.id === vaultItemId
        )
          ? collection.name
          : [];
      })
    );
