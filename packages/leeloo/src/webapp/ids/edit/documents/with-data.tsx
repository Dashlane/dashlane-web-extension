import React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { IdVaultItemType } from 'webapp/ids/types';
import { getBritishSpellingLabel } from 'webapp/ids/helpers';
import { useIdData } from 'webapp/ids/hooks/use-id-data';
import { EditPanel } from '../edit-panel';
import { getTitle } from '../helpers';
import { EditPanelChildren } from '../edit-panel-types';
import { useIdDeleteModal } from '../hooks/use-id-delete-modal';
import { IdDocumentProps } from './types';
interface WithDataTranslationKey {
    HEADER_DESCRIPTION: string;
    ALERT_DELETE: string;
    ALERT_EDIT: string;
    DIALOG_DELETE_TITLE: string;
    COPY_SUCCESS: string;
}
interface WithDataIdDocumentProps extends IdDocumentProps {
    id: string;
    ID_TYPE: IdVaultItemType;
    I18N_KEYS: WithDataTranslationKey;
    children: EditPanelChildren;
}
export const WithData = ({ ID_TYPE, I18N_KEYS, listRoute, id, setDialogActive, lee, hasUnsavedData, setHasUnsavedData, children, }: WithDataIdDocumentProps) => {
    const { translate } = useTranslate();
    const { status, item } = useIdData(ID_TYPE, id);
    const { showConfirmDelete, openConfirmDeleteDialog, closeConfirmDeleteDialog, } = useIdDeleteModal(setDialogActive);
    if (status === DataStatus.Success && item !== undefined) {
        return (<EditPanel itemId={id} item={item} copySuccessKey={I18N_KEYS.COPY_SUCCESS} deleteAlertTranslation={I18N_KEYS.ALERT_DELETE} deleteDialogTitle={I18N_KEYS.DIALOG_DELETE_TITLE} editAlertTranslation={I18N_KEYS.ALERT_EDIT} initialValues={item} listRoute={listRoute} reportError={lee.reportError} showConfirmDelete={showConfirmDelete} openConfirmDeleteDialog={openConfirmDeleteDialog} closeConfirmDeleteDialog={closeConfirmDeleteDialog} hasUnsavedData={hasUnsavedData} setHasUnsavedData={setHasUnsavedData} type={ID_TYPE} getDescription={(country) => getBritishSpellingLabel(translate(I18N_KEYS.HEADER_DESCRIPTION), translate.getLocale(), country)} title={getTitle(item)}>
        {children}
      </EditPanel>);
    }
    return null;
};
