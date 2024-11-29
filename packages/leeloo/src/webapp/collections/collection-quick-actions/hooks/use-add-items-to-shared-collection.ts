import { useModuleCommands } from "@dashlane/framework-react";
import { Permission, sharingCollectionsApi } from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
interface CollectionNameAndId {
  name: string;
  id: string;
}
export const useAddItemsToSharedCollection = () => {
  const { translate } = useTranslate();
  const { addItemsToCollections } = useModuleCommands(sharingCollectionsApi);
  const { commandHandler } = useLoadingCommandWithAlert();
  const errorMessage = translate("_common_generic_error");
  const addItemsToSharedCollection = (
    selectedCollection: CollectionNameAndId,
    itemIds: string[],
    itemPermission: Permission
  ) => {
    const updateSuccessMessage = translate(
      "collections_add_new_items_success_toast_message",
      {
        itemCount: itemIds.length,
        collectionName: selectedCollection.name,
      }
    );
    return commandHandler(
      () => {
        return addItemsToCollections({
          itemIds,
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
  return { addItemsToSharedCollection };
};
