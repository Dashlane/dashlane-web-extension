import { useModuleCommands } from "@dashlane/framework-react";
import {
  Collection,
  OperationType,
  vaultOrganizationApi,
} from "@dashlane/vault-contracts";
import {
  ShareableCollection,
  sharingCollectionsApi,
} from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { useCollectionsContext } from "../../collections-context";
import { CollectionChip, UlColumn } from "../../collections-layout";
import { MenuItemWithActionCard } from "../layout/menu-item-with-action-card";
import { ActionType } from "../active-action-context";
interface Props {
  credentialId: string;
  title: string;
  onUndoClicked: (collection: Collection, credentialId: string) => void;
}
export const RemoveFromACollection = ({
  credentialId,
  title,
  onUndoClicked,
}: Props) => {
  const { allCollections: collections } = useCollectionsContext();
  const { translate } = useTranslate();
  const { commandHandler } = useLoadingCommandWithAlert();
  const { updateCollection } = useModuleCommands(vaultOrganizationApi);
  const { removeItemFromCollections } = useModuleCommands(
    sharingCollectionsApi
  );
  const onClickRemoveFromCollection = (collection: ShareableCollection) => {
    const undoAction = collection.isShared
      ? undefined
      : () => onUndoClicked(collection, credentialId);
    commandHandler(
      () => {
        if (collection.isShared) {
          return removeItemFromCollections({
            itemId: credentialId,
            collectionIds: [collection.id],
          });
        }
        return updateCollection({
          id: collection.id,
          collection: {
            vaultItems: [
              {
                id: credentialId,
              },
            ],
          },
          operationType: OperationType.SUBSTRACT_VAULT_ITEMS,
        });
      },
      translate(
        "webapp_credentials_quick_action_remove_collection_alert_success",
        {
          title: title,
          collectionName: collection.name,
        }
      ),
      translate("_common_generic_error"),
      undoAction
    );
  };
  return (
    <MenuItemWithActionCard
      text={translate("webapp_credentials_quick_action_delete_collection")}
      iconName="ActionCloseOutlined"
      actionType={ActionType.RemoveFrom}
    >
      <UlColumn>
        {collections.flatMap((collection) => {
          if (!collection.vaultItems.some((item) => item.id === credentialId)) {
            return [];
          }
          return (
            <li key={collection.id} sx={{ width: "fit-content" }}>
              <CollectionChip
                isShared={collection.isShared}
                onDismiss={() => onClickRemoveFromCollection(collection)}
              >
                {collection.name}
              </CollectionChip>
            </li>
          );
        })}
      </UlColumn>
    </MenuItemWithActionCard>
  );
};
