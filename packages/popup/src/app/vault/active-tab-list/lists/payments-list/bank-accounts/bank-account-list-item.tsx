import React from 'react';
import { BankAccount, VaultItemType } from '@dashlane/vault-contracts';
import { ItemType } from '@dashlane/hermes';
import { AllowedThumbnailIcons, colors, Thumbnail, } from '@dashlane/ui-components';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import { SectionRow } from '../../common';
import { BankAccountActions } from './bank-account-actions';
export interface BankAccountComponentProps {
    item: BankAccount;
    listContainerRef?: React.RefObject<HTMLElement>;
    listHeaderRef?: React.RefObject<HTMLElement>;
}
const BankAccountComponent = ({ item, listContainerRef, listHeaderRef, }: BankAccountComponentProps) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { bankCode, id, accountName, ownerName, spaceId } = item;
    const openBankAccountDetailView = () => {
        logSelectVaultItem(id, ItemType.BankStatement);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.BankAccount, id);
    };
    const closeDropdown = () => setIsDropdownOpen(false);
    return (<SectionRow key={id} thumbnail={<Thumbnail size="small" icon={AllowedThumbnailIcons.Bank} text={bankCode} backgroundColor={colors.dashGreen00}/>} itemSpaceId={spaceId} title={accountName} subtitle={ownerName} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openBankAccountDetailView} onRowLeave={closeDropdown} actions={<BankAccountActions bankAccount={item} isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen}/>}/>);
};
export const BankAccountListItem = React.memo(BankAccountComponent);
