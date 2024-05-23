import React from 'react';
import { ItemsQueryResult, Website } from '@dashlane/vault-contracts';
import { VaultItemsList } from 'src/app/vault/active-tab-list/lists/common';
import { WebsiteListView } from './website-list-view';
interface WebsiteListProps {
    websitesResult: ItemsQueryResult<Website>;
}
export const WebsiteList = ({ websitesResult }: WebsiteListProps) => (<VaultItemsList ItemComponent={WebsiteListView} items={websitesResult.items} titleKey={'tab/all_items/personal_info/websites/title'} totalItemsCount={websitesResult.matchCount}/>);
