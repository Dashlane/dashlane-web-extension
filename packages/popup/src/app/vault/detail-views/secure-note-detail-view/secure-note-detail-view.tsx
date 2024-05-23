import React, { memo, useEffect } from 'react';
import { jsx } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { DataStatus } from 'libs/api/types';
import { logPageView } from 'src/libs/logs/logEvent';
import { useSecureNoteData } from 'src/libs/api/secureNotes/useSecureNoteData';
import { SecureNoteDetailHeader } from './secure-note-detail-header';
import { SecureNoteDetailForm } from './secure-note-detail-form';
interface SecureNoteDetailViewComponentProps {
    onClose: () => void;
    itemId: string;
}
const SecureNoteDetailViewComponent = ({ onClose, itemId, }: SecureNoteDetailViewComponentProps) => {
    const noteData = useSecureNoteData(itemId);
    useEffect(() => {
        logPageView(PageView.ItemSecureNoteDetails);
    }, []);
    if (noteData.status !== DataStatus.Success || !noteData.data) {
        return null;
    }
    return (<>
      <SecureNoteDetailHeader note={noteData.data} onClose={onClose}/>
      <SecureNoteDetailForm note={noteData.data}/>
    </>);
};
export const SecureNoteDetailView = memo(SecureNoteDetailViewComponent);
