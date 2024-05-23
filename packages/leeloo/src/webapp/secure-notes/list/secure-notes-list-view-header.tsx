import React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { Header } from 'webapp/list-view/header';
import { SX_STYLES } from '../styles';
import { useSecureNotesContext } from '../secure-notes-view/secure-notes-context';
const I18N_KEYS = {
    HEADER_NAME: 'webapp_secure_notes_list_header_name',
    HEADER_CATEGORY: 'webapp_secure_notes_list_header_category',
    HEADER_CREATED: 'webapp_secure_notes_list_header_created',
    HEADER_UPDATED: 'webapp_secure_notes_list_header_updated',
};
export const SecureNotesListViewHeader = () => {
    const { translate } = useTranslate();
    const { setSortOrder, sortingOptions } = useSecureNotesContext();
    return (<Header header={[
            {
                key: 'title',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_NAME),
                logSubaction: 'name',
            },
            {
                key: 'category',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_CATEGORY),
                sxProps: SX_STYLES.CATEGORY_CELL,
                logSubaction: 'category',
            },
            {
                key: 'creationDatetime',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_CREATED),
                sxProps: SX_STYLES.CREATED_CELL,
                logSubaction: 'creationDate',
            },
            {
                key: 'userModificationDatetime',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_UPDATED),
                sxProps: SX_STYLES.UPDATED_CELL,
                logSubaction: 'lastUpdated',
            },
        ]} onSort={setSortOrder} options={sortingOptions}/>);
};
