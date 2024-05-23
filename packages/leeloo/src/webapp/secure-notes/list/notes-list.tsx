import { jsx } from '@dashlane/design-system';
import { SecureNote } from '@dashlane/vault-contracts';
import { NoteRow } from './note-row';
import { NotesEmptyView } from './notes-empty-view';
import { useSecureNotesContext } from '../secure-notes-view/secure-notes-context';
import { InfiniteScrollList } from 'webapp/vault/pagination/infinite-scroll-list';
export const NotesList = () => {
    const { secureNotes, hasMore, onNextPage } = useSecureNotesContext();
    if (!secureNotes?.length) {
        return <NotesEmptyView />;
    }
    return (<div sx={{
            height: '100%',
            overflow: 'auto',
        }}>
      <InfiniteScrollList onNextPage={onNextPage} hasMore={hasMore}>
        {secureNotes.map((secureNote: SecureNote) => (<NoteRow key={`secureNotes_list_secureNoteId_${secureNote.id}`} note={secureNote}/>))}
      </InfiniteScrollList>
    </div>);
};
