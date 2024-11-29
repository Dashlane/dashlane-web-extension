import React from "react";
import { Dialog } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../variables";
import { BaseDeleteDialogProps } from "./confirm-delete-vault-item-dialog";
interface ConfirmDeleteDialogProps extends BaseDeleteDialogProps {
  onDeleteConfirm: () => void;
}
export const ConfirmDeleteDialog = ({
  closeConfirmDeleteDialog,
  onDeleteConfirm,
  translations,
}: ConfirmDeleteDialogProps) => {
  const { translate } = useTranslate();
  const {
    confirmDeleteSubtitle,
    confirmDeleteTitle,
    confirmDeleteDismiss,
    confirmDeleteConfirm,
  } = translations;
  return (
    <Dialog
      title={confirmDeleteTitle}
      onClose={closeConfirmDeleteDialog}
      isOpen
      dialogClassName={allIgnoreClickOutsideClassName}
      closeActionLabel={translate("_common_dialog_dismiss_button")}
      isDestructive
      actions={{
        primary: {
          children: confirmDeleteConfirm,
          onClick: onDeleteConfirm,
          id: "deletion-dialog-confirm-button",
        },
        secondary: {
          children: confirmDeleteDismiss,
          onClick: closeConfirmDeleteDialog,
          autoFocus: true,
          id: "deletion-dialog-dismiss-button",
        },
      }}
    >
      {confirmDeleteSubtitle}
    </Dialog>
  );
};
