import { useModuleCommands } from "@dashlane/framework-react";
import { ShareableCollection } from "@dashlane/sharing-contracts";
import { vaultOrganizationApi } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { AddItemToCollectionInput } from "./types";
export const useAddItemToCollection = () => {
  const { translate } = useTranslate();
  const { commandHandler } = useLoadingCommandWithAlert();
  const { createCollection, updateCollection } =
    useModuleCommands(vaultOrganizationApi);
  const errorMessage = translate("_common_generic_error");
  const addToNewCollection = async (item: AddItemToCollectionInput) => {
    const { collectionName, itemName, itemId, spaceId } = item;
    const createSuccessMessage = translate(
      "collections_quick_action_add_create_success_toast_message",
      {
        vaultItemName: itemName,
        collectionName: collectionName,
      }
    );
    return commandHandler(
      () =>
        createCollection({
          content: {
            name: collectionName,
            spaceId: spaceId ?? "",
            vaultItems: [{ id: itemId }],
          },
        }),
      createSuccessMessage,
      errorMessage
    );
  };
  const addToExistingCollection = async (
    selectedCollection: ShareableCollection,
    item: AddItemToCollectionInput
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
        return updateCollection({
          id: selectedCollection.id,
          collection: {
            vaultItems: [{ id: itemId }],
          },
        });
      },
      updateSuccessMessage,
      errorMessage
    );
  };
  return {
    addToNewCollection,
    addToExistingCollection,
  };
};
