import React from "react";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  Collection,
  OperationType,
  vaultOrganizationApi,
} from "@dashlane/vault-contracts";
import { sharingCollectionsApi } from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { useCollectionsContext } from "../../collections-context";
import { MenuItem } from "../../../credentials/quick-actions-menu/menu/menu-item";
interface Props {
  credentialId: string;
  title: string;
  onUndoClicked: (collection: Collection, credentialId: string) => void;
}
export const RemoveFromActiveCollection = ({
  credentialId,
  title,
  onUndoClicked,
}: Props) => {
  const { activeCollection } = useCollectionsContext();
  const { translate } = useTranslate();
  const { commandHandler } = useLoadingCommandWithAlert();
  const { updateCollection } = useModuleCommands(vaultOrganizationApi);
  const { removeItemFromCollections } = useModuleCommands(
    sharingCollectionsApi
  );
  if (!activeCollection?.id) {
    return null;
  }
  const onClickRemoveFromCollection = () => {
    const undoAction = activeCollection.isShared
      ? undefined
      : () => onUndoClicked(activeCollection, credentialId);
    commandHandler(
      () => {
        if (activeCollection.isShared) {
          return removeItemFromCollections({
            itemId: credentialId,
            collectionIds: [activeCollection.id],
          });
        }
        return updateCollection({
          id: activeCollection.id,
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
          collectionName: activeCollection.name,
        }
      ),
      translate("_common_generic_error"),
      undoAction
    );
  };
  return (
    <MenuItem
      onClick={onClickRemoveFromCollection}
      closeOnClick
      icon="ActionCloseOutlined"
      text={translate(
        "webapp_credentials_quick_action_delete_from_active_collection"
      )}
    />
  );
};
