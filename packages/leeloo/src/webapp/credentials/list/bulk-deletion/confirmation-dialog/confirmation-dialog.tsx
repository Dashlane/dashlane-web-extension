import React, { useState } from "react";
import {
  Credential,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { AlertSeverity, Dialog } from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useAlert } from "../../../../../libs/alert-notifications/use-alert";
import { DialogHeader } from "./dialog-header";
import { DialogContent } from "./dialog-content";
import { useModuleCommands } from "@dashlane/framework-react";
export interface Props {
  credentialsToBeDeleted: Credential[];
  onClose: () => void;
  clearMultiSelection: () => void;
}
const I18N_KEYS = {
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
  SUCCESS_ALERT: "webapp_credentials_multiselect_delete_success_alert",
  WARNING_ALERT:
    "webapp_credentials_multiselect_delete_warning_alert_items_deleted",
  ERROR_ALERT: "webapp_credentials_multiselect_delete_error_alert",
};
export const ConfirmationDialog = ({
  credentialsToBeDeleted,
  onClose,
  clearMultiSelection,
}: Props) => {
  const { translate } = useTranslate();
  const alert = useAlert();
  const [isLoading, setIsLoading] = useState(false);
  const { deleteVaultItems } = useModuleCommands(vaultItemsCrudApi);
  const handleOnConfirmDeletion = async () => {
    setIsLoading(true);
    const credentialIdsToDelete = credentialsToBeDeleted.map(
      (credential) => credential.id
    );
    const deletionResult = await deleteVaultItems({
      vaultItemType: VaultItemType.Credential,
      ids: credentialIdsToDelete,
    });
    if (deletionResult.tag === "success") {
      clearMultiSelection();
      alert.showAlert(
        translate(I18N_KEYS.SUCCESS_ALERT, {
          count: credentialsToBeDeleted.length,
        }),
        AlertSeverity.SUCCESS
      );
    } else if (deletionResult.tag === "failure") {
      alert.showAlert(
        translate(I18N_KEYS.WARNING_ALERT, {
          loginsDeleted:
            credentialsToBeDeleted.length -
            deletionResult.error.failedDeletionIds.length,
          totalNumberOfLogins: credentialsToBeDeleted.length,
        }),
        AlertSeverity.WARNING
      );
    } else {
      alert.showAlert(
        translate(I18N_KEYS.ERROR_ALERT, {
          count: credentialsToBeDeleted.length,
        }),
        AlertSeverity.ERROR
      );
    }
    setIsLoading(false);
    onClose();
  };
  return (
    <Dialog
      isOpen
      disableOutsideClickClose
      disableScrolling
      closeIconName={!isLoading ? translate(I18N_KEYS.CLOSE_DIALOG) : undefined}
      onClose={onClose}
    >
      <DialogHeader amountToBeDeleted={credentialsToBeDeleted.length} />
      <DialogContent
        credentialsToBeDeleted={credentialsToBeDeleted}
        isLoading={isLoading}
        onCancel={onClose}
        onConfirm={handleOnConfirmDeletion}
      />
    </Dialog>
  );
};
