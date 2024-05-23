import { memo, RefObject } from 'react';
import { jsx } from '@dashlane/ui-components';
import { Company, VaultItemType } from '@dashlane/vault-contracts';
import { ItemType } from '@dashlane/hermes';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { CompanyIcon } from './company-icon';
export interface CompanyProps {
    item: Company;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
}
const CompanyComponent = ({ item, listContainerRef, listHeaderRef, }: CompanyProps) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, spaceId, companyName, jobTitle } = item;
    const openCompanyDetailView = () => {
        logSelectVaultItem(id, ItemType.Company);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Company, id);
    };
    return (<SectionRow key={id} thumbnail={<CompanyIcon />} itemSpaceId={spaceId} title={companyName} subtitle={jobTitle} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openCompanyDetailView}/>);
};
export const CompanyListItem = memo(CompanyComponent);
