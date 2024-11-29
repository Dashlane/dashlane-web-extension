import { DataStatus } from "@dashlane/framework-react";
import { Permission, ShareableCollection } from "@dashlane/sharing-contracts";
import { useMemo, useState } from "react";
import { AlertSeverity } from "@dashlane/ui-components";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { useIsPersonalSpaceDisabled } from "../../../libs/hooks/use-is-personal-space-disabled";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useDialog } from "../../dialog";
import { CollectionInputWithSelection } from "../collections-layout";
import { useCollectionsContext } from "../collections-context";
import { ShareItemInsufficientPermissionsDialog } from "../../credentials/form/collections-field/share-item-insufficient-permissions-dialog";
import { AddSharedCollectionDialog } from "../../credentials/form/collections-field/add-shared-collection-dialog";
import { MenuItemWithActionCard } from "./layout/menu-item-with-action-card";
import { ActionType } from "./active-action-context";
import { useAddItemToCollection } from "./hooks/use-add-item-to-collection";
import { useAddItemToSharedCollection } from "./hooks/use-add-item-to-shared-collection";
import { AddItemToCollectionInput } from "./hooks/types";
export interface AddToCollectionActionProps {
  itemId: string;
  itemName: string;
  itemSpaceId: string;
  isSharedWithLimitedRights: boolean;
  itemUrl?: string;
  onActionComplete?: () => void;
}
export const AddToCollectionAction = ({
  itemId,
  itemName,
  itemSpaceId,
  isSharedWithLimitedRights,
  itemUrl,
  onActionComplete,
}: AddToCollectionActionProps) => {
  const { translate } = useTranslate();
  const { openDialog, closeDialog } = useDialog();
  const { showAlert } = useAlert();
  const { addToNewCollection, addToExistingCollection } =
    useAddItemToCollection();
  const { addToSharedCollection } = useAddItemToSharedCollection();
  const { allCollections: collections } = useCollectionsContext();
  const [input, setInput] = useState("");
  const isPersonalSpaceDisabledResult = useIsPersonalSpaceDisabled();
  const vaultItemCollections = useMemo(
    () =>
      collections.filter((collection) =>
        isPersonalSpaceDisabledResult.status === DataStatus.Success &&
        isPersonalSpaceDisabledResult.isDisabled
          ? !collection.vaultItems.some((item) => item.id === itemId)
          : collection.spaceId === itemSpaceId &&
            !collection.vaultItems.some((item) => item.id === itemId)
      ),
    [collections, isPersonalSpaceDisabledResult]
  );
  const handleAddSharedCollection = (
    selectedCollection: ShareableCollection,
    item: AddItemToCollectionInput
  ) => {
    if (isSharedWithLimitedRights) {
      openDialog(
        <ShareItemInsufficientPermissionsDialog onClose={closeDialog} />
      );
    } else {
      const handleSubmit = (itemPermission: Permission) =>
        addToSharedCollection(selectedCollection, item, itemPermission).then(
          () => {
            closeDialog();
            setInput("");
          }
        );
      openDialog(
        <AddSharedCollectionDialog
          onSubmit={handleSubmit}
          onClose={closeDialog}
          itemTitle={itemName}
          collectionName={selectedCollection.name}
        />
      );
    }
  };
  const onSubmit = (collectionName = input) => {
    collectionName = collectionName.trim();
    if (collectionName.length <= 0) {
      return;
    }
    const selectedCollection = collections.find(
      (collection) =>
        collection.name === collectionName && collection.spaceId === itemSpaceId
    );
    const item = {
      collectionName,
      itemName,
      itemId,
      spaceId: itemSpaceId,
      url: itemUrl,
    };
    if (!selectedCollection) {
      addToNewCollection(item).then(() => setInput(""));
      return;
    }
    const alreadyExists =
      vaultItemCollections.filter(
        (vaultItem) => vaultItem.name === collectionName
      ).length === 0;
    if (alreadyExists) {
      showAlert(
        translate("webapp_collection_already_created_warning"),
        AlertSeverity.ERROR
      );
      return;
    }
    if (selectedCollection.isShared) {
      handleAddSharedCollection(selectedCollection, item);
    } else {
      addToExistingCollection(selectedCollection, item).then(() =>
        setInput("")
      );
    }
    onActionComplete?.();
  };
  return (
    <MenuItemWithActionCard
      text={translate("collections_quick_action_add_menu_text")}
      iconName="CollectionOutlined"
      actionType={ActionType.AddTo}
    >
      <CollectionInputWithSelection
        collections={vaultItemCollections}
        id={`add_to_collection_action_for_${itemId}`}
        input={input}
        spaceId={itemSpaceId}
        onSubmit={onSubmit}
        setInput={setInput}
        sx={{
          width: "inherit",
          "> div:first-of-type": {
            margin: "8px",
            width: "unset",
          },
        }}
      />
    </MenuItemWithActionCard>
  );
};
