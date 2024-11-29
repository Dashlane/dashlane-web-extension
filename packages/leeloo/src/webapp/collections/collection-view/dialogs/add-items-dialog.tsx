import {
  Dialog,
  DialogFooter,
  DialogTitle,
  SearchField,
} from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useMemo, useState } from "react";
import {
  SortDirection,
  VaultItem,
  VaultItemType,
  vaultOrganizationApi,
  vaultSearchApi,
} from "@dashlane/vault-contracts";
import { Permission } from "@dashlane/sharing-contracts";
import { ItemsTabs } from "../../../sharing-invite/types";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { CredentialsCollectionDialogList } from "./list/credentials-collection-dialog-list";
import { SecureNotesCollectionDialogList } from "./list/secure-notes-collection-dialog-list";
import { CredentialsNotesToggle } from "../collection-view-header/credentials-notes-toggle";
import { PermissionStep } from "../../../sharing-invite/permission";
import { useAddItemsToSharedCollection } from "../../collection-quick-actions/hooks/use-add-items-to-shared-collection";
import { useLoadingCommandWithAlert } from "../../use-loading-command-with-alert";
import { useMultiselectContext } from "../../../list-view/multi-select/multi-select-context";
export interface AddItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  collectionName: string;
  spaceId: string;
  isSharedCollection: boolean;
  collectionId: string;
  vaulItemsInCollection: string[];
}
const I18N_KEYS = {
  ADD_TO_COLLECTION:
    "webapp_login_add_item_to_shared_collection_dialog_confirm_button",
  CANCEL: "_common_action_cancel",
  DIALOG_TITLE: "webapp_collection_add_items_dialog_title",
  GENERIC_ERROR: "_common_generic_error",
  SEARCH_LABEL: "webapp_sidemenu_search_placeholder",
  SUCCESS_MESSAGE: "collections_add_new_items_success_toast_message",
};
const PAGE_SIZE = 20;
export const AddItemsDialog = ({
  isOpen,
  onClose,
  collectionName,
  spaceId,
  isSharedCollection,
  collectionId,
  vaulItemsInCollection,
}: AddItemsDialogProps) => {
  const { translate } = useTranslate();
  const [tab, setTab] = useState(ItemsTabs.Passwords);
  const [searchItem, setSearchItem] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { commandHandler } = useLoadingCommandWithAlert();
  const { updateCollection } = useModuleCommands(vaultOrganizationApi);
  const [isPermissionStepOpen, setIsPermissionStepOpen] = useState(false);
  const [itemPermissions, setItemPermissions] = useState<Permission>(
    Permission.Limited
  );
  const { getSelectedItems } = useMultiselectContext();
  const { addItemsToSharedCollection } = useAddItemsToSharedCollection();
  const haveItemsSelected =
    getSelectedItems?.(["credentials", "notes"])?.length > 0;
  const { data, status } = useModuleQuery(vaultSearchApi, "search", {
    searchQuery: searchItem,
    vaultItemTypes: [VaultItemType.Credential, VaultItemType.SecureNote],
    pageNumber: 1,
    pageSize: PAGE_SIZE * pageNumber,
    propertyFilters:
      spaceId !== null
        ? [
            {
              property: "spaceId",
              value: spaceId,
            },
          ]
        : undefined,
    propertySorting: {
      property: "title",
      direction: SortDirection.Ascend,
    },
  });
  const handleClose = () => {
    setSearchItem("");
    onClose();
  };
  const handleAddToSharedCollection = () => {
    const selectedIds = getSelectedItems(["credentials", "notes"]);
    addItemsToSharedCollection(
      { id: collectionId, name: collectionName },
      selectedIds,
      itemPermissions
    );
    handleClose();
    setIsPermissionStepOpen(false);
  };
  const handleAddToCollection = () => {
    const selectedIds = getSelectedItems(["credentials", "notes"]);
    const ids = selectedIds.map((id) => ({ id }));
    if (isSharedCollection) {
      return setIsPermissionStepOpen(true);
    }
    commandHandler(
      () =>
        updateCollection({
          id: collectionId,
          collection: {
            vaultItems: ids,
          },
        }),
      translate(I18N_KEYS.SUCCESS_MESSAGE, {
        itemCount: selectedIds.length,
        collectionName: collectionName,
      }),
      translate(I18N_KEYS.GENERIC_ERROR)
    );
    handleClose();
  };
  const credentialsNotAlreadyAdded = useMemo(
    () =>
      data?.credentialsResult.items.filter(
        (item: VaultItem) => !vaulItemsInCollection?.includes(item.id)
      ) ?? [],
    [data?.credentialsResult.items, vaulItemsInCollection]
  );
  const secureNotesNotAlreadyAdded = useMemo(
    () =>
      data?.secureNotesResult.items.filter(
        (item: VaultItem) => !vaulItemsInCollection?.includes(item.id)
      ) ?? [],
    [data?.secureNotesResult.items, vaulItemsInCollection]
  );
  if (status !== DataStatus.Success || data === undefined) {
    return null;
  }
  if (isPermissionStepOpen) {
    return (
      <Dialog
        onClose={() => {
          setIsPermissionStepOpen(false);
          handleClose();
        }}
        isOpen={isPermissionStepOpen}
        closeActionLabel={translate("_common_dialog_dismiss_button")}
      >
        <PermissionStep
          goToStep={() => {
            setIsPermissionStepOpen(false);
          }}
          onClick={handleAddToSharedCollection}
          isCollectionSharing
          isLoading={false}
          permission={itemPermissions}
          onSelectPermission={setItemPermissions}
        />
      </Dialog>
    );
  }
  return (
    <Dialog
      onClose={handleClose}
      isOpen={isOpen}
      closeActionLabel={translate("_common_dialog_dismiss_button")}
      sx={{ height: "calc(100vh - 68px)" }}
      aria-label={translate("webapp_collection_bulk_action_add_items")}
    >
      <DialogTitle
        title={
          collectionName
            ? translate(I18N_KEYS.DIALOG_TITLE, {
                name: collectionName,
              })
            : ""
        }
      />
      <CredentialsNotesToggle
        isNotesViewDisplayed={tab === ItemsTabs.SecureNotes}
        setTab={setTab}
        additionalStyle={{ margin: "0" }}
      />
      <SearchField
        label={translate(I18N_KEYS.SEARCH_LABEL)}
        sx={{ marginBottom: "8px" }}
        value={searchItem}
        onChange={(event) => setSearchItem(event.target.value)}
      />
      <div>
        {tab === ItemsTabs.Passwords ? (
          <CredentialsCollectionDialogList
            credentials={credentialsNotAlreadyAdded}
            matchCount={data.credentialsResult.matchCount}
            setPageNumber={setPageNumber}
            isSharedCollection={isSharedCollection}
          />
        ) : null}
        {tab === ItemsTabs.SecureNotes ? (
          <SecureNotesCollectionDialogList
            secureNotes={secureNotesNotAlreadyAdded}
            matchCount={data.secureNotesResult.matchCount}
            setPageNumber={setPageNumber}
            isSharedCollection={isSharedCollection}
          />
        ) : null}
      </div>
      <DialogFooter
        actions={{
          primary: {
            children: translate(I18N_KEYS.ADD_TO_COLLECTION),
            onClick: handleAddToCollection,
            disabled: !haveItemsSelected,
          },
          secondary: {
            children: translate(I18N_KEYS.CANCEL),
          },
        }}
      />
    </Dialog>
  );
};
