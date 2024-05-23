import { memo, RefObject } from 'react';
import { jsx } from '@dashlane/ui-components';
import { ItemType } from '@dashlane/hermes';
import { VaultItemType, Website } from '@dashlane/vault-contracts';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { WebsiteIcon } from './website-icon';
export interface WebsiteProps {
    item: Website;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
}
const WebsiteComponent = ({ item, listContainerRef, listHeaderRef, }: WebsiteProps) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, spaceId, itemName, URL } = item;
    const openWebsiteDetailView = () => {
        logSelectVaultItem(id, ItemType.Website);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Website, id);
    };
    return (<SectionRow key={id} thumbnail={<WebsiteIcon />} itemSpaceId={spaceId} title={itemName} subtitle={URL} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openWebsiteDetailView}/>);
};
export const WebsiteListView = memo(WebsiteComponent);
