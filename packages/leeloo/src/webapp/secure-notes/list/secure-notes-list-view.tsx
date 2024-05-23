import { jsx } from '@dashlane/design-system';
import { NotesList } from './notes-list';
import { SecureNotesListViewHeader } from './secure-notes-list-view-header';
export const SecureNotesListView = () => {
    return (<div style={{
            position: 'relative',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
      <SecureNotesListViewHeader />
      <NotesList />
    </div>);
};
