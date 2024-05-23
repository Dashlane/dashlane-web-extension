import { CredentialItemView, DataModelType, GroupRecipient, NoteItemView, UserGroupDownload, UserRecipient, } from '@dashlane/communication';
import { NoteColors, Secret, SecureNote, SecureNoteSchema, VaultItemType, } from '@dashlane/vault-contracts';
import { SecureNoteView } from 'webapp/secure-notes/types';
import { CollectionItemView } from './item-row';
export const isItemACredential = (item: CredentialItemView | SecureNote | NoteItemView | UserGroupDownload | CollectionItemView | Secret): item is CredentialItemView => {
    return item['kwType'] && item['kwType'] === DataModelType.KWAuthentifiant;
};
export const isItemOldSecureNote = (item: CredentialItemView | SecureNote | NoteItemView | UserGroupDownload | CollectionItemView | Secret): item is NoteItemView => {
    return item['kwType'] && item['kwType'] === DataModelType.KWSecureNote;
};
export const isItemANote = (item: unknown): item is SecureNote => {
    return SecureNoteSchema.safeParse(item).success;
};
export const isItemASecret = (item: CredentialItemView | SecureNote | NoteItemView | Secret | CollectionItemView | UserGroupDownload): item is Secret => {
    return item['kwType'] && item['kwType'] === VaultItemType.Secret;
};
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
export const isUserGroup = (entity: UserRecipient | GroupRecipient): entity is GroupRecipient => {
    return entity.type === 'userGroup';
};
