import React from "react";
import { VaultItemType } from "@dashlane/vault-contracts";
import { SocialSecurityIdForm } from "../../form/documents/social-security-id-form";
import { WithData } from "./with-data";
import { IdDocumentProps } from "./types";
const I18N_KEYS = {
  HEADER_DESCRIPTION: "webapp_id_edition_socialsecurity_header_description",
  DIALOG_DELETE_TITLE: "webapp_id_edition_socialsecurity_dialog_delete_title",
  ALERT_DELETE: "webapp_id_edition_socialsecurity_alert_delete",
  ALERT_EDIT: "webapp_id_edition_socialsecurity_alert_edit",
  COPY_SUCCESS: "webapp_id_copy_success_social_security_id_number",
};
export const SocialSecurityIdEditPanel = ({
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
      ID_TYPE={VaultItemType.SocialSecurityId}
      I18N_KEYS={I18N_KEYS}
    >
      {({ handleCopy }) => (
        <SocialSecurityIdForm variant="edit" handleCopy={handleCopy} />
      )}
    </WithData>
  ) : null;
};
