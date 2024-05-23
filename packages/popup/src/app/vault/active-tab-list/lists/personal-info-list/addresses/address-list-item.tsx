import { memo, RefObject } from 'react';
import { jsx } from '@dashlane/ui-components';
import { Address, VaultItemType } from '@dashlane/vault-contracts';
import { ItemType } from '@dashlane/hermes';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { AddressIcon } from './address-icon';
export interface AddressProps {
    item: Address;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
}
const AddressComponent = ({ item, listContainerRef, listHeaderRef, }: AddressProps) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, spaceId, itemName, streetName, zipCode, city } = item;
    const openAddressDetailView = () => {
        logSelectVaultItem(id, ItemType.Address);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Address, id);
    };
    return (<SectionRow key={id} thumbnail={<AddressIcon />} itemSpaceId={spaceId} title={itemName} subtitle={`${streetName}, ${zipCode}, ${city}`} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openAddressDetailView}/>);
};
export const AddressListItem = memo(AddressComponent);
