import React from 'react';
import { BankAccount, ItemsQueryResult } from '@dashlane/vault-contracts';
import { VaultItemsList } from '../../common';
import { BankAccountListItem } from './bank-account-list-item';
interface Props {
    bankAccountsResult: ItemsQueryResult<BankAccount>;
}
export const BankAccountsList = ({ bankAccountsResult }: Props) => (<VaultItemsList ItemComponent={BankAccountListItem} items={bankAccountsResult.items} titleKey={'tab/all_items/payments/bank_accounts/title'} totalItemsCount={bankAccountsResult.matchCount}/>);
