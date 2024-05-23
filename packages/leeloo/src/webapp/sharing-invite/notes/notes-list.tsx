import React from 'react';
import { SecureNote } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { getNoteLogo, Item, ItemNotFound } from 'webapp/sharing-invite/item';
const I18N_KEYS = {
    NO_NOTES: 'webapp_sharing_invite_no_notes_found',
    NO_SELECTED: 'webapp_sharing_invite_no_selected_notes_found',
};
export interface Props {
    freeLimitReached: boolean;
    onCheckNote: (id: string, checked: boolean) => void;
    selectedNotes: string[];
    elementsOnlyShowSelected: boolean;
    secureNotes: SecureNote[];
}
export const NotesList = (props: Props) => {
    const { freeLimitReached, onCheckNote, selectedNotes, elementsOnlyShowSelected, secureNotes, } = props;
    const { translate } = useTranslate();
    if (!secureNotes?.length) {
        const copy = elementsOnlyShowSelected
            ? translate(I18N_KEYS.NO_SELECTED)
            : translate(I18N_KEYS.NO_NOTES);
        return <ItemNotFound text={copy}/>;
    }
    return (<ul>
      {secureNotes?.map((note: SecureNote, index: number) => {
            if (!note ||
                (elementsOnlyShowSelected && !selectedNotes.includes(note.id))) {
                return null;
            }
            const logo = getNoteLogo(note);
            const onCheck = (isChecked: boolean) => onCheckNote(note.id, isChecked);
            const checked = selectedNotes.includes(note.id);
            return (<Item key={index} {...{
                logo,
                onCheck,
                checked,
                item: note,
                freeLimitReached,
                title: note.title,
            }}/>);
        })}
    </ul>);
};
