import { memo, RefObject } from 'react';
import { jsx } from '@dashlane/ui-components';
import { ItemType } from '@dashlane/hermes';
import { Phone, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { PhoneIcon } from './phone-icon';
export interface Props {
    item: Phone;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
}
const PhoneComponent = ({ item, listContainerRef, listHeaderRef }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, spaceId, phoneNumber, numberInternational, numberNational } = item;
    const openPhoneDetailView = () => {
        logSelectVaultItem(id, ItemType.Phone);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Phone, id);
    };
    return (<SectionRow key={id} thumbnail={<PhoneIcon />} itemSpaceId={spaceId} title={phoneNumber} subtitle={numberInternational || numberNational} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openPhoneDetailView}/>);
};
export const PhoneListItem = memo(PhoneComponent);
