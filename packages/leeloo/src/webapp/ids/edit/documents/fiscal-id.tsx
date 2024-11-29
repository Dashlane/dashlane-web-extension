import React from "react";
import { VaultItemType } from "@dashlane/vault-contracts";
import { FiscalIdForm } from "../../form/documents/fiscal-id-form";
import { IdDocumentProps } from "./types";
import { WithData } from "./with-data";
const I18N_KEYS = {
  HEADER_DESCRIPTION: "webapp_id_edition_fiscalid_header_description",
  ALERT_DELETE: "webapp_id_edition_fiscalid_alert_delete",
  ALERT_EDIT: "webapp_id_edition_fiscalid_alert_edit",
  DIALOG_DELETE_TITLE: "webapp_id_edition_fiscalid_dialog_delete_title",
  COPY_SUCCESS: "webapp_id_copy_success_fiscalid_number",
};
export const FiscalIdEditPanel = ({
  listRoute,
  id,
  setDialogActive,
  lee,
  hasUnsavedData,
  setHasUnsavedData,
}: IdDocumentProps) => {
  return id ? (
    <WithData
      listRoute={listRoute}
      id={`{${id}}`}
      setDialogActive={setDialogActive}
      lee={lee}
      hasUnsavedData={hasUnsavedData}
      setHasUnsavedData={setHasUnsavedData}
      ID_TYPE={VaultItemType.FiscalId}
      I18N_KEYS={I18N_KEYS}
    >
      {({ handleCopy }) => (
        <FiscalIdForm variant="edit" handleCopy={handleCopy} />
      )}
    </WithData>
  ) : null;
};
