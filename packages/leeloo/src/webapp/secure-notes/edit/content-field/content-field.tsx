import { useState } from 'react';
import { jsx } from '@dashlane/design-system';
import ReactMarkdown from 'react-markdown';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import styles from './styles.css';
import { MarkdownToolbar } from '../markdown-toolbar/markdown-toolbar-component';
import { formatMarkdownSource } from 'webapp/secure-notes/helpers';
export type FieldElement = HTMLTextAreaElement;
export const SUPPORT_MARKDOWN_IN_NOTES = FEATURE_FLIPS_WITHOUT_MODULE.SupportMarkdownInSecureNotes;
interface SecureNoteContentFieldProps {
    name?: string;
    placeholder?: string;
    value: string;
    disabled?: boolean;
    readonly?: boolean;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    fieldRef: React.RefObject<HTMLTextAreaElement>;
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setContent: (content: string) => void;
}
export const SecureNoteContentField = ({ fieldRef, value, name, placeholder, disabled, readonly, isEditing, setContent, setIsEditing, onChange, }: SecureNoteContentFieldProps) => {
    const [isPreviewing, setIsPreviewing] = useState(false);
    const retrievedFFStatus = useFeatureFlips();
    const hasMarkdownSupportFF = () => {
        return retrievedFFStatus.status === DataStatus.Success
            ? !!retrievedFFStatus.data[SUPPORT_MARKDOWN_IN_NOTES]
            : false;
    };
    return (<div className={styles.content} onClick={hasMarkdownSupportFF()
            ? () => {
                setIsEditing(true);
            }
            : undefined}>
      {hasMarkdownSupportFF() ? (!isEditing && value ? (<div className={styles.markdown}>
            <ReactMarkdown source={formatMarkdownSource(value)} softBreak="br"/>
          </div>) : (<div sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
            }} onClick={() => {
                if (isPreviewing) {
                    setIsPreviewing(false);
                }
            }}>
            <MarkdownToolbar content={value} setContent={setContent} fieldRef={fieldRef} isPreviewing={isPreviewing} setIsPreviewing={(isPreviewing: boolean) => setIsPreviewing(isPreviewing)}/>
            {isPreviewing ? (<div className={styles.markdown}>
                <ReactMarkdown source={formatMarkdownSource(value)} softBreak="br"/>
              </div>) : (<textarea ref={fieldRef} name={name} className={styles.textarea} sx={{
                    color: 'ds.text.neutral.catchy',
                }} placeholder={placeholder} value={value || ''} disabled={disabled} readOnly={readonly} onChange={(event) => {
                    if (onChange) {
                        onChange(event);
                    }
                }}/>)}
          </div>)) : (<textarea ref={fieldRef} name={name} className={styles.textarea} sx={{
                color: 'ds.text.neutral.catchy',
            }} placeholder={placeholder} value={value || ''} disabled={disabled} readOnly={readonly} onChange={(event) => {
                if (onChange) {
                    onChange(event);
                }
            }}/>)}
    </div>);
};
