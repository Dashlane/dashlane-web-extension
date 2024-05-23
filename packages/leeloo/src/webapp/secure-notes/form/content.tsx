import React, { ChangeEventHandler, useRef, useState } from 'react';
import { AlertSeverity } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SecureNoteContentField } from 'webapp/secure-notes/edit/content-field/content-field';
import { MAX_AUTHORIZED_CHARACTERS } from 'webapp/secure-notes/form/secure-notes-form';
import { PopupAlert } from 'webapp/family-dashboard/popup-alert/popup-alert';
import style from 'webapp/secure-notes/form/style.css';
const I18N_KEYS = {
    DISABLE_LABEL: 'webapp_secure_notes_edition_disabled_label',
    PLACEHOLDER_NO_CONTENT: 'webapp_secure_notes_addition_field_placeholder_no_content',
    ALERT_COPY_PAST_ERROR: 'webapp_secure_notes_addition_field_copy_past_error',
};
interface Props {
    content: string;
    setContent: (content: string) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    limitedPermissions?: boolean;
    readonly?: boolean;
}
export const SecureNoteContent = ({ content, setContent, isEditing, setIsEditing, limitedPermissions, readonly, }: Props) => {
    const { translate } = useTranslate();
    const [showAlert, setShowAlert] = useState(false);
    const field = useRef<HTMLTextAreaElement | null>(null);
    const handleContentFieldChange: ChangeEventHandler<HTMLTextAreaElement> = ({ target: { value }, }): void => {
        const userWantsToAddContent = value.length > content.length;
        const maxAuthorizedCharactersAlreadyReached = content.length >= MAX_AUTHORIZED_CHARACTERS;
        if (userWantsToAddContent && maxAuthorizedCharactersAlreadyReached) {
            return;
        }
        const userWantsToAddBigContent = userWantsToAddContent && value.length > MAX_AUTHORIZED_CHARACTERS;
        const newContent = userWantsToAddBigContent ? content : value;
        setShowAlert(userWantsToAddBigContent);
        setContent(newContent);
    };
    return (<>
      <SecureNoteContentField fieldRef={field} placeholder={translate(readonly ? I18N_KEYS.DISABLE_LABEL : I18N_KEYS.PLACEHOLDER_NO_CONTENT)} value={content} disabled={limitedPermissions} readonly={readonly} onChange={handleContentFieldChange} isEditing={isEditing} setIsEditing={setIsEditing} setContent={setContent}/>

      {showAlert && (<div className={style.alertContainer}>
          <PopupAlert id={Math.floor(Math.random() * 1e6)} message={translate(I18N_KEYS.ALERT_COPY_PAST_ERROR)} onHide={() => {
                setShowAlert(false);
            }} severity={AlertSeverity.WARNING}/>
        </div>)}
    </>);
};
