import React, { ChangeEventHandler, useRef, useState } from 'react';
import { AlertSeverity } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { SecretContentField } from 'webapp/secrets/edit/content-field/content-field';
import { MAX_AUTHORIZED_CHARACTERS } from 'webapp/secrets/form/secret-form';
import { PopupAlert } from 'webapp/family-dashboard/popup-alert/popup-alert';
import style from 'webapp/secrets/form/style.css';
const I18N_KEYS = {
    DISABLE_LABEL: 'webapp_secure_notes_edition_disabled_label',
    PLACEHOLDER_NO_CONTENT: 'webapp_secrets_addition_field_placeholder_no_content',
    ALERT_COPY_PAST_ERROR: 'webapp_secure_notes_addition_field_copy_past_error',
};
interface Props {
    content: string;
    setContent: (content: string) => void;
    limitedPermissions?: boolean;
}
export const SecretsContent = ({ content, setContent, limitedPermissions, }: Props) => {
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
      <SecretContentField fieldRef={field} placeholder={translate(I18N_KEYS.PLACEHOLDER_NO_CONTENT)} value={content} disabled={limitedPermissions} onChange={handleContentFieldChange}/>

      {showAlert && (<div className={style.alertContainer}>
          <PopupAlert id={Math.floor(Math.random() * 1e6)} message={translate(I18N_KEYS.ALERT_COPY_PAST_ERROR)} onHide={() => {
                setShowAlert(false);
            }} severity={AlertSeverity.WARNING}/>
        </div>)}
    </>);
};
