import React, { PropsWithChildren } from 'react';
import { SecureNote, VaultItemType } from '@dashlane/vault-contracts';
import { logSelectSecureNote } from 'libs/logs/events/vault/select-item';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useItemSearchData } from 'webapp/sidemenu/search/results/use-item-search-data';
import { NoteSearchItem } from 'webapp/sidemenu/search/items';
import SearchEventLogger from '../../search-event-logger';
import { SearchResultsSection } from './search-results-section';
const I18N_KEYS = {
    SECURE_NOTES_HEADER: 'webapp_sidemenu_search_results_heading_secure_notes',
};
export type NotesProps = PropsWithChildren<{
    query: string;
}>;
export const Notes = ({ query }: NotesProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { loadMore, result } = useItemSearchData<SecureNote>(query, VaultItemType.SecureNote);
    if (!result?.matchCount) {
        return null;
    }
    const { items, matchCount } = result;
    SearchEventLogger.updateSearchSubTypes('notes', matchCount);
    return (<SearchResultsSection i18nKey={I18N_KEYS.SECURE_NOTES_HEADER} loadMore={loadMore} matchCount={matchCount} loadedCount={items.length}>
      {items.map((note, index) => (<NoteSearchItem detailRoute={routes.userSecureNote(note.id)} key={note.id} note={note} onSelectNote={() => {
                SearchEventLogger.logSearchEvent();
                logSelectSecureNote(note.id, index + 1, matchCount);
            }}/>))}
    </SearchResultsSection>);
};
