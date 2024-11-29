import { useModuleCommands } from "@dashlane/framework-react";
import { vaultOrganizationApi } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { BaseDialog, BaseDialogProps } from "./base-dialog";
import { CollectionFields, useCollectionForm } from "./collection-form";
import { ShareCollectionInfo } from "../../../notifications/share-collection-info";
import { useTeamSpaceContext } from "../../../../team/settings/components/TeamSpaceContext";
import { useCollectionsContext } from "../../collections-context";
import { FormEvent, useCallback } from "react";
const createDialogFormId = "createDialogFormId";
export const CreateDialog = (props: BaseDialogProps) => {
  const { translate } = useTranslate();
  const { createCollection } = useModuleCommands(vaultOrganizationApi);
  const { commandHandler, isLoading } = useLoadingCommandWithAlert();
  const { allCollections: collections } = useCollectionsContext();
  const { onClose } = props;
  const { teamId: defaultSpaceId } = useTeamSpaceContext();
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
    initialSpaceId: defaultSpaceId ? String(defaultSpaceId) : undefined,
    collections,
  });
  const handleSubmit = useCallback(async () => {
    const hasDuplicate = checkDuplicate();
    if (hasDuplicate) {
      return;
    }
    await commandHandler(
      () =>
        createCollection({
          content: {
            name,
            spaceId,
          },
        }),
      translate("collections_dialog_create_success_toast_message", {
        name,
      }),
      translate("collections_dialog_create_error_toast_message")
    );
    onClose();
  }, [
    checkDuplicate,
    commandHandler,
    createCollection,
    name,
    onClose,
    spaceId,
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
      title={translate("collections_dialog_create_header_title")}
      content={
        <>
          <ShareCollectionInfo />
          <form id={createDialogFormId} onSubmit={onSubmit}>
            <CollectionFields
              spaceId={spaceId}
              name={name}
              isLocked={isLocked}
              isDuplicated={isDuplicate}
              onNameChange={onNameChange}
              onSpaceChange={onSpaceChange}
            />
          </form>
        </>
      }
      confirmAction={{
        disabled: isDisabled,
        isLoading,
        children: translate("collections_dialog_create_button_text"),
        type: "submit",
        form: createDialogFormId,
      }}
      {...props}
    />
  );
};
