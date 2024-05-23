import React from 'react';
import { ItemType } from '@dashlane/hermes';
import { PaymentCard, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { PaymentCardIcon } from './payment-card-icon/payment-card-icon';
import { PaymentCardActions } from './payment-card-actions';
export interface PaymentCardComponentProps {
    item: PaymentCard;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
const PaymentCardComponent = ({ item, listContainerRef, listHeaderRef, }: PaymentCardComponentProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { cardNumber, color, id, itemName, spaceId } = item;
    const openPaymentCardDetailView = () => {
        logSelectVaultItem(id, ItemType.CreditCard);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.PaymentCard, id);
    };
    const closeDropdown = () => setIsDropdownOpen(false);
    return (<SectionRow key={id} thumbnail={<PaymentCardIcon paymentCardColor={color}/>} itemSpaceId={spaceId} title={itemName} subtitle={`•••• •••• •••• ${cardNumber.slice(-4)}`} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openPaymentCardDetailView} onRowLeave={closeDropdown} actions={<PaymentCardActions paymentCard={item} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}/>}/>);
};
export const PaymentCardListItem = React.memo(PaymentCardComponent);
