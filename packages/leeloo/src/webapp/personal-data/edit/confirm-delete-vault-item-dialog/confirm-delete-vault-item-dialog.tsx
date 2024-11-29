import React from "react";
import { useToast } from "@dashlane/design-system";
import { DataStatus, useModuleCommands } from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { CantDeleteReason, DeleteTranslations } from "../types";
import { CantDeleteDialog } from "./cant-delete-dialog";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
export interface BaseDeleteDialogProps {
  translations: DeleteTranslations;
  closeConfirmDeleteDialog: () => void;
}
interface SharingStatus {
  isShared: boolean;
  lastAdmin?: boolean;
  groupSharing?: boolean;
}
interface ConfirmDeleteVaultItemDialogProps extends BaseDeleteDialogProps {
  isVisible: boolean;
  itemId: string;
  onDeletionSuccess: () => void;
  vaultItemType: VaultItemType;
  sharingStatus?: SharingStatus;
  goToSharingAccess?: () => void;
  isSharedViaUserGroup?: boolean;
  isItemInCollection?: boolean;
  isShared?: boolean;
  isLastAdmin?: boolean;
}
export const ConfirmDeleteVaultItemDialog = ({
  closeConfirmDeleteDialog,
  goToSharingAccess,
  isVisible,
  itemId,
  onDeletionSuccess,
  sharingStatus,
  translations,
  vaultItemType,
  isShared,
  isSharedViaUserGroup,
  isItemInCollection,
  isLastAdmin,
}: ConfirmDeleteVaultItemDialogProps) => {
  const { showToast } = useToast();
  const { translate } = useTranslate();
  const { deleteVaultItems } = useModuleCommands(vaultItemsCrudApi);
  if (!isVisible) {
    return null;
  }
  let cantDeleteReason: CantDeleteReason | undefined;
  if (isShared || sharingStatus?.isShared) {
    if (isSharedViaUserGroup) {
      cantDeleteReason = CantDeleteReason.GroupSharing;
    }
    if (isLastAdmin) {
      cantDeleteReason = CantDeleteReason.LastAdmin;
    }
    if (isItemInCollection) {
      cantDeleteReason = CantDeleteReason.CollectionSharing;
    }
  }
  if (cantDeleteReason && goToSharingAccess) {
    return (
      <CantDeleteDialog
        reason={cantDeleteReason}
        translations={translations}
        goToSharingAccess={goToSharingAccess}
        closeCantDeleteDialog={closeConfirmDeleteDialog}
      />
    );
  }
  const onDelete = async () => {
    try {
      const deletionResult = await deleteVaultItems({
        ids: [itemId],
        vaultItemType,
      });
      if (deletionResult.tag === DataStatus.Success) {
        showToast({
          description:
            translations.deleteSuccessToast ??
            translate("webapp_personal_info_edition_delete_success_toast"),
        });
        onDeletionSuccess();
      } else {
        showToast({
          description: translate("_common_generic_error"),
          mood: "danger",
          isManualDismiss: true,
        });
      }
    } catch (error) {
      showToast({
        description: translate("_common_generic_error"),
        mood: "danger",
        isManualDismiss: true,
      });
    }
  };
  return (
    <ConfirmDeleteDialog
      closeConfirmDeleteDialog={closeConfirmDeleteDialog}
      onDeleteConfirm={onDelete}
      translations={translations}
    />
  );
};
