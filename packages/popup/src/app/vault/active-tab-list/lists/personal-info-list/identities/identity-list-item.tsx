import { memo, RefObject } from 'react';
import { parse as dateParser } from 'date-fns';
import { jsx } from '@dashlane/ui-components';
import { Identity, VaultItemType } from '@dashlane/vault-contracts';
import { ItemType } from '@dashlane/hermes';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import useTranslate from 'src/libs/i18n/useTranslate';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { SectionRow } from '../../common';
import { IdentityIcon } from './identity-icon';
export interface Props {
    item: Identity;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
}
export function parseDate(date: string): Date {
    if (!date) {
        return new Date();
    }
    const birthDateParsed = dateParser(date, 'yyyy-MM-dd', new Date());
    return birthDateParsed.toString() !== 'Invalid Date'
        ? birthDateParsed
        : new Date(date);
}
const IdentityComponent = ({ item, listContainerRef, listHeaderRef, }: Props) => {
    const { openDetailView } = useVaultItemDetailView();
    const { searchValue } = useSearchContext();
    const { id, spaceId, firstName, lastName, birthDate, birthPlace } = item;
    const { getLocaleMeta } = useTranslate();
    const openIdentityDetailView = () => {
        logSelectVaultItem(id, ItemType.Identity);
        if (searchValue !== '') {
            SearchEventLogger.logSearchEvent();
        }
        openDetailView(VaultItemType.Identity, id);
    };
    return (<SectionRow key={id} thumbnail={<IdentityIcon />} itemSpaceId={spaceId} title={`${firstName} ${lastName.toUpperCase()}`} subtitle={`${Intl.DateTimeFormat(getLocaleMeta()?.code, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        }).format(parseDate(birthDate))}, ${birthPlace}`} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openIdentityDetailView}/>);
};
export const IdentityListItem = memo(IdentityComponent);
