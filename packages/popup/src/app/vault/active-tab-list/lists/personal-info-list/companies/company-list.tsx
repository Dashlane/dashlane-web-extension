import React from 'react';
import { Company, ItemsQueryResult } from '@dashlane/vault-contracts';
import { VaultItemsList } from 'src/app/vault/active-tab-list/lists/common';
import { CompanyListItem } from './company-list-item';
interface CompanyListProps {
    companiesResult: ItemsQueryResult<Company>;
}
export const CompanyList = ({ companiesResult }: CompanyListProps) => (<VaultItemsList ItemComponent={CompanyListItem} items={companiesResult.items} titleKey={'tab/all_items/personal_info/companies/title'} totalItemsCount={companiesResult.matchCount}/>);
