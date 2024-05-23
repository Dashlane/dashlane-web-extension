import { jsx } from '@dashlane/design-system';
import { Fragment, memo } from 'react';
import { BankAccount, ItemsQueryResult } from '@dashlane/vault-contracts';
import { BankAccountListHeader } from 'webapp/payments/bank-accounts/list/list-header/bank-account-list-header';
import { BankAccountListItem } from 'webapp/payments/bank-accounts/list/list-item/bank-account-list-item';
export interface BankAccountListViewProps {
    bankAccountsResult: ItemsQueryResult<BankAccount>;
}
const BankAccountsListViewComponent = ({ bankAccountsResult, }: BankAccountListViewProps) => {
    return (<>
      <BankAccountListHeader quantity={bankAccountsResult.matchCount}/>
      <ul sx={{ minWidth: '800px', paddingBottom: '32px' }}>
        {bankAccountsResult.items.map((bankAccount) => (<BankAccountListItem key={bankAccount.id} bankAccount={bankAccount}/>))}
      </ul>
    </>);
};
export const BankAccountsListView = memo(BankAccountsListViewComponent);
