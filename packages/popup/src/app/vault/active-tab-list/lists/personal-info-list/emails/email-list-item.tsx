import { memo, RefObject } from 'react';
import { jsx } from '@dashlane/ui-components';
import { ItemType } from '@dashlane/hermes';
import { Email, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { EmailIcon } from './email-icon';
export interface Props {
    item: Email;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
}
const EmailComponent = ({ item, listContainerRef, listHeaderRef }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, spaceId, itemName, emailAddress } = item;
    const openEmailDetailView = () => {
        logSelectVaultItem(id, ItemType.Email);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Email, id);
    };
    return (<SectionRow key={id} thumbnail={<EmailIcon />} itemSpaceId={spaceId} title={itemName} subtitle={emailAddress} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openEmailDetailView}/>);
};
export const EmailListItem = memo(EmailComponent);
