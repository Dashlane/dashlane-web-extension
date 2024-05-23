import React, { useEffect, useState } from 'react';
import { SecretSortField } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { OrderDir } from 'libs/sortHelper';
import { SECRETS_LIST_PREFERENCES } from 'libs/localstorage-constants';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { SortingOptions } from 'webapp/list-view/types';
import { Header as ListHeader } from 'webapp/list-view/header';
import { UpgradeNoticeBanner, UpgradeNoticeType, } from 'webapp/credentials/header/upgrade-notice-banner';
import { SecretsHeader } from './header/secrets-header';
import styles from './styles.css';
import { SecretsList } from './list/secrets-list';
const I18N_KEYS = {
    HEADER_NAME: 'webapp_secure_notes_list_header_name',
    HEADER_CREATED: 'webapp_secure_notes_list_header_created',
    HEADER_UPDATED: 'webapp_secure_notes_list_header_updated',
};
export interface State {
    sortingOptions: SortingOptions<SecretSortField>;
}
export const Secrets = () => {
    const [sortingOptions, setSortingOptions] = useState<SortingOptions>({
        field: 'title',
        direction: OrderDir.ascending,
    });
    const { translate } = useTranslate();
    const restoreFromStorage = () => {
        const preferences = localStorage.getItem(SECRETS_LIST_PREFERENCES);
        try {
            if (preferences) {
                const storedSorting = JSON.parse(preferences);
                setSortingOptions(storedSorting.sortingOptions);
            }
        }
        catch (err) {
        }
    };
    useEffect(() => {
        restoreFromStorage();
    }, []);
    const saveToStorage = (state: State) => {
        localStorage.setItem(SECRETS_LIST_PREFERENCES, JSON.stringify(state));
    };
    const getHeader = () => {
        return [
            {
                key: 'title',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_NAME),
                logSubaction: 'name',
            },
            {
                key: 'createdAt',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_CREATED),
                className: styles.created,
                logSubaction: 'creationDate',
            },
            {
                key: 'updatedAt',
                sortable: true,
                content: translate(I18N_KEYS.HEADER_UPDATED),
                className: styles.updated,
                logSubaction: 'lastUpdated',
            },
        ];
    };
    const sortSecrets = (sortingOptions: SortingOptions<SecretSortField>) => {
        setSortingOptions(sortingOptions);
        saveToStorage({ sortingOptions });
    };
    const onSort = (sortingOptions: SortingOptions<SecretSortField>) => {
        sortSecrets(sortingOptions);
    };
    const getSortCriteria = (): SortingOptions[] => {
        const { field } = sortingOptions;
        const fixedField = getHeader()
            .map((h) => h.key)
            .includes(field)
            ? (field as SecretSortField)
            : 'title';
        const baseOptions: SortingOptions[] = [
            {
                direction: sortingOptions.direction,
                field: fixedField,
            },
        ];
        return baseOptions;
    };
    const getContent = () => {
        const header = (<ListHeader header={getHeader()} onSort={onSort} options={sortingOptions}/>);
        return (<SecretsList header={header} className={styles.list} sortCriteria={getSortCriteria()}/>);
    };
    return (<PersonalDataSectionView>
      <SecretsHeader />
      <UpgradeNoticeBanner customSx={{ margin: '0 32px 30px' }} noticeType={UpgradeNoticeType.SecureNotes}/>
      {getContent()}
    </PersonalDataSectionView>);
};
