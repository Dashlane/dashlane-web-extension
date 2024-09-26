import {
  Collection,
  CollectionCommandResult,
  RemoveItemsFromCollectionsRequest,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { collectionsSelector } from "../selectors";
import { updateCollectionHandler } from "./updateCollectionHandler";
export async function removeItemsFromCollectionsHandler(
  services: Pick<CoreServices, "sessionService" | "storeService">,
  request: RemoveItemsFromCollectionsRequest
): Promise<CollectionCommandResult> {
  const state = services.storeService.getState();
  const existingCollections = collectionsSelector(state);
  const updatedCollections: Collection[] = [];
  let lengthPreFiltering;
  let lengthPostFiltering;
  existingCollections.forEach((collection) => {
    lengthPreFiltering = collection.VaultItems.length;
    collection.VaultItems = collection.VaultItems.filter(
      (vaultItem) => !request.ids.includes(vaultItem.Id)
    );
    lengthPostFiltering = collection.VaultItems.length;
    if (lengthPreFiltering !== lengthPostFiltering) {
      updatedCollections.push(collection);
    }
  });
  if (!updatedCollections.length) {
    return;
  }
  const updateCollectionPromises = updatedCollections.map((updatedCollection) =>
    updateCollectionHandler(services, {
      id: updatedCollection.Id,
      name: updatedCollection.Name,
      spaceId: updatedCollection.SpaceId,
      vaultItems: updatedCollection.VaultItems.map((item) => ({
        id: item.Id,
        type: item.Type,
      })),
    })
  );
  const updateCollectionResults = await Promise.all(updateCollectionPromises);
  return {
    success: !updateCollectionResults.some(
      (collectionResult) => !collectionResult.success
    ),
  };
}
