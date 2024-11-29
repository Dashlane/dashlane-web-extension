import { VaultItemType } from "@dashlane/vault-contracts";
import { IdCardForm } from "../../form/documents/id-card-form";
import { IdDocumentProps } from "./types";
import { WithData } from "./with-data";
const I18N_KEYS = {
  HEADER_DESCRIPTION: "webapp_id_edition_idcard_header_description",
  DIALOG_DELETE_TITLE: "webapp_id_edition_idcard_dialog_delete_title",
  ALERT_DELETE: "webapp_id_edition_idcard_alert_delete",
  ALERT_EDIT: "webapp_id_edition_idcard_alert_edit",
  COPY_SUCCESS: "webapp_id_copy_success_id_card_number",
};
export enum IdGroupTab {
  DETAILS,
  ATTACHMENTS,
}
export const IdCardEditPanel = ({
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
      ID_TYPE={VaultItemType.IdCard}
      I18N_KEYS={I18N_KEYS}
    >
      {({ handleCopy, values }) => (
        <IdCardForm
          variant="edit"
          handleCopy={handleCopy}
          country={values.country}
        />
      )}
    </WithData>
  ) : null;
};
