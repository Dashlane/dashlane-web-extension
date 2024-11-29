import { useModuleCommands } from "@dashlane/framework-react";
import { Permission, sharingCollectionsApi } from "@dashlane/sharing-contracts";
import { OperationType, vaultOrganizationApi } from "@dashlane/vault-contracts";
import { FieldCollection } from "../../credentials/form/collections-field/collections-field-context";
import { DataModelType } from "@dashlane/communication";
const isNewCollection = (collection: FieldCollection) =>
  !collection.initiallyExisting && !collection.hasBeenDeleted;
const isCollectionUntouched = (collection: FieldCollection) =>
  collection.initiallyExisting && !collection.hasBeenDeleted;
export const useAddNoteToCollections = () => {
  const { createCollection, updateCollection } =
    useModuleCommands(vaultOrganizationApi);
  const { addItemsToCollections, removeItemFromCollections } =
    useModuleCommands(sharingCollectionsApi);
  const addNoteToCollections = async (
    noteId: string,
    collections: FieldCollection[]
  ) => {
    const sharedCollectionsToAdd = [];
    const sharedCollectionsToRemoveIds = [];
    for (const collection of collections) {
      if (isCollectionUntouched(collection)) {
        continue;
      }
      if (collection.isShared) {
        if (isNewCollection(collection)) {
          sharedCollectionsToAdd.push({
            collectionId: collection.id,
            permission: collection.itemPermission ?? Permission.Limited,
          });
        } else {
          sharedCollectionsToRemoveIds.push(collection.id);
        }
        continue;
      }
      collection.vaultItems = [
        {
          id: noteId,
          type: DataModelType.KWSecureNote,
        },
      ];
      if (collection.id) {
        await updateCollection({
          id: collection.id,
          collection: collection,
          operationType: collection.hasBeenDeleted
            ? OperationType.SUBSTRACT_VAULT_ITEMS
            : OperationType.APPEND_VAULT_ITEMS,
        });
      } else {
        await createCollection({
          content: collection,
        });
      }
    }
    if (sharedCollectionsToAdd.length) {
      await addItemsToCollections({
        collectionPermissions: sharedCollectionsToAdd,
        itemIds: [noteId],
        shouldSkipSync: sharedCollectionsToRemoveIds.length > 0,
      });
    }
    if (sharedCollectionsToRemoveIds.length) {
      await removeItemFromCollections({
        collectionIds: sharedCollectionsToRemoveIds,
        itemId: noteId,
      });
    }
  };
  return { addNoteToCollections };
};
