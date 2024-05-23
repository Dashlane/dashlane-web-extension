import { NoteItemView } from '@dashlane/communication';
import { NoteColors, SecureNote } from '@dashlane/vault-contracts';
import { SecureNoteView } from 'webapp/secure-notes/types';
export const convertNewSecureNoteToView = (secureNote: SecureNote): SecureNoteView => ({
    color: secureNote.color,
    title: secureNote.title,
    hasAttachments: !!secureNote.attachments?.length,
    isSecured: secureNote.isSecured,
    id: secureNote.id,
});
export const convertToSecureNoteView = (secureNote: NoteItemView): SecureNoteView => ({
    color: NoteColors[secureNote.color],
    title: secureNote.title,
    hasAttachments: secureNote.hasAttachments,
    isSecured: secureNote.secured,
    id: secureNote.id,
});
