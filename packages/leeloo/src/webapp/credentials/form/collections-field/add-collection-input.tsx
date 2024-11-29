import { useRef } from "react";
import { Button, Icon } from "@dashlane/design-system";
import { Permission } from "@dashlane/sharing-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useDialog } from "../../../dialog";
import { CollectionInputWithSelection } from "../../../collections/collections-layout";
import {
  useCollectionsFieldContext,
  useCollectionsFieldUpdateContext,
} from "./collections-field-context";
import { AddSharedCollectionDialog } from "./add-shared-collection-dialog";
import { ShareItemInsufficientPermissionsDialog } from "./share-item-insufficient-permissions-dialog";
interface Props {
  id: string;
  hasCollections: boolean;
  setHasOpenedDialogs?: (value: boolean) => void;
  isDisabled?: boolean;
}
export const AddCollectionInput = ({
  id,
  hasCollections,
  setHasOpenedDialogs,
  isDisabled = false,
}: Props) => {
  const { translate } = useTranslate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { isInputVisible, itemSpaceId, filteredCollections, input, vaultItem } =
    useCollectionsFieldContext();
  const { vaultItemTitle, isSharedWithLimitedRights } = vaultItem;
  const { openDialog, closeDialog } = useDialog();
  const { setInput, setIsInputVisible, onSubmit } =
    useCollectionsFieldUpdateContext();
  const handleSubmit = (
    itemPermission: Permission,
    collectionName?: string
  ) => {
    onSubmit(collectionName, itemPermission);
    closeDialog();
    setHasOpenedDialogs?.(false);
    inputRef.current?.focus();
  };
  const handleCancel = () => {
    closeDialog();
    setHasOpenedDialogs?.(false);
  };
  const handleSubmitWithConfirmation = (collectionName?: string) => {
    const collection = filteredCollections.find(
      (c) => c.name === collectionName && c.spaceId === itemSpaceId
    );
    if (collection?.isShared && isSharedWithLimitedRights) {
      openDialog(
        <ShareItemInsufficientPermissionsDialog onClose={handleCancel} />
      );
      setHasOpenedDialogs?.(true);
    } else if (collection?.isShared) {
      openDialog(
        <AddSharedCollectionDialog
          onSubmit={handleSubmit}
          onClose={handleCancel}
          itemTitle={vaultItemTitle}
          collectionName={collection.name}
        />
      );
      setHasOpenedDialogs?.(true);
    } else {
      handleSubmit(Permission.Admin, collectionName);
    }
  };
  return isInputVisible ? (
    <CollectionInputWithSelection
      collections={filteredCollections}
      id={id}
      input={input}
      inputRef={inputRef}
      spaceId={itemSpaceId}
      selectionAsDropdown
      onSubmit={handleSubmitWithConfirmation}
      setInput={setInput}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          window.setTimeout(() => {
            setIsInputVisible(false);
          }, 100);
        }
      }}
    />
  ) : (
    <Button
      onClick={() => setIsInputVisible(true)}
      layout="iconLeading"
      intensity="supershy"
      disabled={isDisabled}
      mood="neutral"
      icon={<Icon name="ActionAddOutlined" />}
    >
      {hasCollections
        ? translate("webapp_collections_input_placeholder_add_another")
        : translate("webapp_collections_input_placeholder_add_new")}
    </Button>
  );
};
