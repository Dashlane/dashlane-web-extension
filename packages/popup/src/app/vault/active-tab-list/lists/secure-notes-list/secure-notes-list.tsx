import { useRef } from 'react';
import { CredentialSearchOrder } from '@dashlane/communication';
import { Highlight, ItemType } from '@dashlane/hermes';
import { jsx, LoaderIcon } from '@dashlane/ui-components';
import { SecureNote, VaultItemType } from '@dashlane/vault-contracts';
import { ConfirmLabelMode } from 'src/app/protected-items-unlocker/master-password-dialog';
import useProtectedItemsUnlocker from 'src/app/protected-items-unlocker/useProtectedItemsUnlocker';
import { SectionListHeaderWithSort, useListKeyboardNavContext, } from 'src/app/vault/active-tab-list/lists/common';
import { useVaultItemDetailView } from 'src/app/vault/detail-views';
import SearchEventLogger from 'src/app/vault/search-event-logger';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { useIntersectionObserver } from 'src/libs/hooks/useIntersectionObserver';
import { logSelectVaultItem } from 'src/libs/logs/events/vault/select-item';
import { VaultItemOrigin } from '../../../types';
import styles from '../common/sharedListStyles.css';
import { SecureNoteItem } from './secure-note-item/secure-note-item';
interface SecureNotesListProps {
    notes: SecureNote[];
    notesCount: number;
    onOrderChange: (value: CredentialSearchOrder) => void;
    order: CredentialSearchOrder;
    hasMore: boolean;
    isNextPageLoading: boolean;
    onLoadMore: () => void;
}
export const SecureNotesList = ({ notes, notesCount, onOrderChange, order, hasMore, isNextPageLoading, onLoadMore, }: SecureNotesListProps) => {
    const { searchValue } = useSearchContext();
    const containerRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const { openProtectedItemsUnlocker, areProtectedItemsUnlocked } = useProtectedItemsUnlocker();
    const { openDetailView } = useVaultItemDetailView();
    const { onKeyDown } = useListKeyboardNavContext();
    const isSearching = searchValue !== '';
    const openSecureNotesDetailView = (note: SecureNote, origin: VaultItemOrigin, listIndex?: number, listLength?: number) => {
        const openNoteDetails = () => {
            logSelectVaultItem(note.id, ItemType.SecureNote, listIndex, listLength, origin === 'suggested' ? Highlight.Suggested : Highlight.None);
            openDetailView(VaultItemType.SecureNote, note.id);
            if (isSearching) {
                SearchEventLogger.logSearchEvent();
            }
        };
        if (!areProtectedItemsUnlocked && note.isSecured) {
            return openProtectedItemsUnlocker({
                confirmLabelMode: ConfirmLabelMode.ShowNote,
                onSuccess: openNoteDetails,
                onError: () => {
                },
                onCancel: () => {
                },
                showNeverAskOption: false,
                credentialId: note.id,
            });
        }
        else {
            openNoteDetails();
        }
    };
    useIntersectionObserver({
        hasMore,
        bottomRef,
        loadMore: onLoadMore,
    });
    return (<div className={styles.listContent} ref={containerRef}>
      <SectionListHeaderWithSort headerRef={headerRef} sortingOrder={order} onOrderChange={onOrderChange} credentialsCount={notesCount}/>
      <div onKeyDown={onKeyDown}>
        {notes.map((note: SecureNote, index) => (<SecureNoteItem key={note.id} note={note} onOpenDetailsView={(secNote: SecureNote, origin: VaultItemOrigin) => {
                if (isSearching) {
                    openSecureNotesDetailView(secNote, origin, index + 1, notes.length);
                }
                else {
                    openSecureNotesDetailView(secNote, origin);
                }
            }} listContainerRef={containerRef} listHeaderRef={headerRef} origin={isSearching ? 'search' : 'list'}/>))}
      </div>
      <div ref={bottomRef} sx={{
            paddingBottom: '20px',
        }}>
        {isNextPageLoading ? (<div className={styles.loader}>
            <LoaderIcon />
          </div>) : null}
      </div>
    </div>);
};
