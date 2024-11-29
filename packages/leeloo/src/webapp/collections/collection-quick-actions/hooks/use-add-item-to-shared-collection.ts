import { useModuleCommands } from "@dashlane/framework-react";
import {
  Permission,
  ShareableCollection,
  sharingCollectionsApi,
} from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { AddItemToCollectionInput } from "./types";
export const useAddItemToSharedCollection = () => {
  const { translate } = useTranslate();
  const { addItemsToCollections } = useModuleCommands(sharingCollectionsApi);
  const { commandHandler } = useLoadingCommandWithAlert();
  const errorMessage = translate("_common_generic_error");
  const addToSharedCollection = (
    selectedCollection: ShareableCollection,
    item: AddItemToCollectionInput,
    itemPermission: Permission
  ) => {
    const { collectionName, itemName, itemId } = item;
    const updateSuccessMessage = translate(
      "collections_quick_action_add_update_success_toast_message",
      {
        vaultItemName: itemName,
        collectionName: collectionName,
      }
    );
    return commandHandler(
      () => {
        return addItemsToCollections({
          itemIds: [itemId],
          collectionPermissions: [
            {
              collectionId: selectedCollection.id,
              permission: itemPermission,
            },
          ],
        });
      },
      updateSuccessMessage,
      errorMessage
    );
  };
  return { addToSharedCollection };
};
