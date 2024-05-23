import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import { CredentialSearchOrder } from '@dashlane/communication';
import { Option, Select } from 'components/dropdown/Select';
import { SectionListHeader } from '../section-list-header/section-list-header';
const I18N_KEYS = {
    SORT_BY_DATE: 'tab/all_items/sort_criteria/by_date',
    SORT_BY_NAME: 'tab/all_items/sort_criteria/by_name',
    SORT_BY_TITLE: 'tab/all_items/sort_criteria/title',
};
interface Props {
    sortingOrder: string;
    onOrderChange: (value: CredentialSearchOrder) => void;
    credentialsCount: number;
    headerRef: React.RefObject<HTMLDivElement>;
}
const SectionListHeaderWithSort = ({ sortingOrder, onOrderChange, credentialsCount, headerRef, }: Props) => {
    const { translate } = useTranslate();
    const sortingOptions: Option<CredentialSearchOrder>[] = [
        {
            label: translate(I18N_KEYS.SORT_BY_NAME),
            value: CredentialSearchOrder.NAME,
        },
        {
            label: translate(I18N_KEYS.SORT_BY_DATE),
            value: CredentialSearchOrder.DATE,
        },
    ];
    const getListLabel = () => {
        const item = sortingOptions.find((propItem) => propItem.value === sortingOrder);
        return item ? item.label : 'sort-criteria-listbox-label';
    };
    return (<SectionListHeader headerRef={headerRef} itemsCount={credentialsCount}>
      <Select items={sortingOptions.map((item) => ({
            ...item,
            active: item.value === sortingOrder,
        }))} onChange={onOrderChange} optionsTitle={translate(I18N_KEYS.SORT_BY_TITLE)} listLabel={getListLabel()} small={true}/>
    </SectionListHeader>);
};
export default SectionListHeaderWithSort;
