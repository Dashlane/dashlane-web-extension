import React from 'react';
import { ItemsQueryResult, Phone } from '@dashlane/vault-contracts';
import { VaultItemsList } from 'src/app/vault/active-tab-list/lists/common';
import { PhoneListItem } from './phone-list-item';
interface PhoneListProps {
    phonesResult: ItemsQueryResult<Phone>;
}
export const PhoneList = ({ phonesResult }: PhoneListProps) => (<VaultItemsList ItemComponent={PhoneListItem} items={phonesResult.items} titleKey={'tab/all_items/personal_info/phones/title'} totalItemsCount={phonesResult.matchCount}/>);
