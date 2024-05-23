import React from 'react';
import { ItemsQueryResult, PaymentCard } from '@dashlane/vault-contracts';
import { VaultItemsList } from '../../common';
import { PaymentCardListItem } from './payment-card-list-item';
interface Props {
    paymentCardsResult: ItemsQueryResult<PaymentCard>;
}
export const PaymentCardsList = ({ paymentCardsResult }: Props) => (<VaultItemsList ItemComponent={PaymentCardListItem} items={paymentCardsResult.items} titleKey={'tab/all_items/payments/credit_debit_cards/title'} totalItemsCount={paymentCardsResult.matchCount}/>);
