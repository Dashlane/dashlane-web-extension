import React from 'react';
import { VaultItemType } from '@dashlane/vault-contracts';
import { PassportForm } from 'webapp/ids/form/documents/passport-form';
import { IdDocumentProps } from './types';
import { WithData } from './with-data';
const I18N_KEYS = {
    HEADER_DESCRIPTION: 'webapp_id_edition_passport_header_description',
    ALERT_DELETE: 'webapp_id_edition_passport_alert_delete',
    ALERT_EDIT: 'webapp_id_edition_passport_alert_edit',
    DIALOG_DELETE_TITLE: 'webapp_id_edition_passport_dialog_delete_title',
    COPY_SUCCESS: 'webapp_id_copy_success_passport_number',
};
export const PassportEditPanel = ({ listRoute, id, setDialogActive, lee, hasUnsavedData, setHasUnsavedData, }: IdDocumentProps) => {
    return id ? (<WithData listRoute={listRoute} id={`{${id}}`} setDialogActive={setDialogActive} lee={lee} hasUnsavedData={hasUnsavedData} setHasUnsavedData={setHasUnsavedData} ID_TYPE={VaultItemType.Passport} I18N_KEYS={I18N_KEYS}>
      {({ handleCopy, values }) => (<PassportForm variant="edit" handleCopy={handleCopy} country={values.country}/>)}
    </WithData>) : null;
};
