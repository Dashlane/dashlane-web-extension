import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { jsx } from '@dashlane/ui-components';
import { NoteDetailView } from '@dashlane/communication';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import useTranslate from 'libs/i18n/useTranslate';
import { formatMarkdownSource } from '../helpers';
export const I18N_KEYS = {
    NOTE_COPIED: 'tab/all_items/credential/actions/note_copied_to_clipboard',
    NOTE_LABEL: 'tab/all_items/credential/view/label/note',
    NOTE_COPY: 'tab/all_items/credential/view/action/copy_note',
};
export const SUPPORT_MARKDOWN_IN_NOTES = FEATURE_FLIPS_WITHOUT_MODULE.SupportMarkdownInSecureNotes;
interface SecureNoteDetailFormProps {
    note: NoteDetailView;
}
const SecureNoteDetailFormComponent = ({ note }: SecureNoteDetailFormProps) => {
    const { translate } = useTranslate();
    const retrievedFFStatus = useFeatureFlips();
    const hasMarkdownSupportFF = () => {
        return retrievedFFStatus.status === DataStatus.Success
            ? !!retrievedFFStatus.data[SUPPORT_MARKDOWN_IN_NOTES]
            : false;
    };
    return (<div sx={{
            position: 'relative',
            height: '433px',
            display: 'flex',
            padding: '16px',
            backgroundColor: 'white',
            overflowY: 'auto',
            maxWidth: '100%',
        }}>
      {hasMarkdownSupportFF() ? (<ReactMarkdown sx={{
                '& ul': {
                    listStyle: 'inside',
                },
                '& ol': {
                    listStyle: 'inside',
                    listStyleType: 'decimal',
                },
            }} aria-label={translate(I18N_KEYS.NOTE_LABEL)} source={formatMarkdownSource(note.content)} softBreak="br"/>) : (<textarea readOnly value={note.content} sx={{
                fontFamily: 'var(--font)',
                fontSize: 'var(--body-medium-font-size)',
                lineHeight: 'var(--body-medium-line-height)',
                width: '100%',
                resize: 'none',
                wordWrap: 'break-word',
                border: 'none',
                cursor: 'default',
                '&:focus': {
                    outline: 'none',
                },
            }} aria-label={translate(I18N_KEYS.NOTE_LABEL)}/>)}
    </div>);
};
export const SecureNoteDetailForm = memo(SecureNoteDetailFormComponent);
