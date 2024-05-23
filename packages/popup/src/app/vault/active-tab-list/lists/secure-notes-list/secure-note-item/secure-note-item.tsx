import { memo, RefObject, useCallback } from 'react';
import { jsx } from '@dashlane/ui-components';
import { SecureNote } from '@dashlane/vault-contracts';
import { VaultItemOrigin } from '../../../../types';
import { SectionRow } from '../../common';
import { NoteIcon } from './note-icon/note-icon';
export interface CredentialItemComponentProps {
    note: SecureNote;
    onOpenDetailsView: (note: SecureNote, origin: VaultItemOrigin) => void;
    listContainerRef: RefObject<HTMLElement>;
    listHeaderRef?: RefObject<HTMLElement>;
    origin: VaultItemOrigin;
}
const THRESHOLD = 30;
const SecureNoteItemComponent = ({ note, listContainerRef, listHeaderRef, onOpenDetailsView, origin, }: CredentialItemComponentProps) => {
    const openDetailsView = useCallback(() => onOpenDetailsView(note, origin), [note, onOpenDetailsView, origin]);
    const getAbbreviatedContent = (isSecured = false, content = '') => {
        if (isSecured) {
            return '*******';
        }
        if (content.length > THRESHOLD) {
            return content.slice(0, THRESHOLD - 3) + '\u2026';
        }
        return content;
    };
    return (<SectionRow thumbnail={<NoteIcon noteType={note.color}/>} itemSpaceId={note.spaceId} title={note.title} subtitle={getAbbreviatedContent(note.isSecured, note.content)} containerRef={listContainerRef} headerRef={listHeaderRef} onClick={openDetailsView}/>);
};
export const SecureNoteItem = memo(SecureNoteItemComponent);
