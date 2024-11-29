import React, { FormEvent, useCallback } from "react";
import { useModuleCommands } from "@dashlane/framework-react";
import { sharingCollectionsApi } from "@dashlane/sharing-contracts";
import { Collection, vaultOrganizationApi } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { BaseDialog, BaseDialogProps } from "./base-dialog";
import { CollectionFields, useCollectionForm } from "./collection-form";
import { useCollectionsContext } from "../../collections-context";
export type EditDialogCollectionProps = Omit<Collection, "vaultItems"> & {
  isShared?: boolean;
};
export type EditDialogProps = EditDialogCollectionProps & BaseDialogProps;
const editDialogFormId = "editDialogFormId";
export const EditDialog = ({
  id,
  isShared,
  name: initialName,
  spaceId: lockedSpaceId,
  onClose,
  ...rest
}: EditDialogProps) => {
  const { translate } = useTranslate();
  const { updateCollection } = useModuleCommands(vaultOrganizationApi);
  const { renameCollection } = useModuleCommands(sharingCollectionsApi);
  const { commandHandler, isLoading } = useLoadingCommandWithAlert();
  const { allCollections: collections } = useCollectionsContext();
  const {
    name,
    spaceId,
    isLocked,
    isDisabled,
    isDuplicate,
    checkDuplicate,
    onNameChange,
    onSpaceChange,
  } = useCollectionForm({
    initialName,
    collections,
    lockedSpaceId,
  });
  const handleSubmit = useCallback(async () => {
    const hasDuplicate = checkDuplicate();
    if (hasDuplicate) {
      return;
    }
    if (isShared) {
      const renameParams = { collectionId: id, newName: name };
      await commandHandler(
        () => renameCollection(renameParams),
        translate("_common_toast_changes_saved"),
        translate("_common_generic_error")
      );
    } else {
      await commandHandler(
        () =>
          updateCollection({
            id,
            collection: {
              name,
            },
          }),
        translate("_common_toast_changes_saved"),
        translate("_common_generic_error")
      );
    }
    onClose();
  }, [
    id,
    name,
    isShared,
    checkDuplicate,
    onClose,
    commandHandler,
    renameCollection,
    updateCollection,
    translate,
  ]);
  const onSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );
  return (
    <BaseDialog
      title={translate("collections_dialog_edit_header_title")}
      content={
        <form id={editDialogFormId} onSubmit={onSubmit}>
          <CollectionFields
            spaceId={spaceId}
            name={name}
            isLocked={isLocked}
            isDuplicated={isDuplicate}
            onNameChange={onNameChange}
            onSpaceChange={onSpaceChange}
          />
        </form>
      }
      confirmAction={{
        disabled: isDisabled,
        isLoading,
        children: translate("_common_action_save"),
        type: "submit",
        form: editDialogFormId,
      }}
      onClose={onClose}
      {...rest}
    />
  );
};
