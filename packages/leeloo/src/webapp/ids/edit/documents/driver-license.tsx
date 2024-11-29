import React from "react";
import { VaultItemType } from "@dashlane/vault-contracts";
import { DriverLicenseForm } from "../../form/documents/driver-license-form";
import { IdDocumentProps } from "./types";
import { WithData } from "./with-data";
const I18N_KEYS = {
  HEADER_DESCRIPTION: "webapp_id_edition_driverlicense_header_description",
  ALERT_DELETE: "webapp_id_edition_driverlicense_alert_delete",
  ALERT_EDIT: "webapp_id_edition_driverlicense_alert_edit",
  DIALOG_DELETE_TITLE: "webapp_id_edition_driverlicense_dialog_delete_title",
  COPY_SUCCESS: "webapp_id_copy_success_driverlicence_number",
};
export const DriverLicenseEditPanel = ({
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
      ID_TYPE={VaultItemType.DriversLicense}
      I18N_KEYS={I18N_KEYS}
    >
      {({ handleCopy, values }) => (
        <DriverLicenseForm
          variant="edit"
          handleCopy={handleCopy}
          handleError={lee.reportError}
          country={values.country}
        />
      )}
    </WithData>
  ) : null;
};
