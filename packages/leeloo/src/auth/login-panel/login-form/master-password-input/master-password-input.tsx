import React from 'react';
import { PasswordInput } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
export const I18N_KEYS = {
    LABEL: 'webapp_login_form_password_fieldset_password_label',
    PLACEHOLDER: 'webapp_login_form_password_fieldset_password_placeholder',
    HIDE_LABEL: 'webapp_login_form_password_fieldset_password_hide_label',
    SHOW_LABEL: 'webapp_login_form_password_fieldset_password_show_label',
    EMPTY_MASTER_PASSWORD: 'webapp_login_form_password_fieldset_security_code_error_empty_password',
    NETWORK_ERROR: 'webapp_login_form_password_fieldset_network_error_offline',
    WRONG_PASSWORD: 'webapp_login_form_password_fieldset_security_code_error_wrong_password',
    THROTTLED: 'webapp_login_form_password_fieldset_error_throttled',
    UNKNOWN_ERROR: 'webapp_login_form_password_fieldset_security_code_error_unkown',
    USER_UNAUTHORIZED: 'webapp_login_form_email_fieldset_error_user_unauthorized',
    UNKNOWN_SYNC_ERROR_EXTENSION: 'webapp_login_form_email_fieldset_error_initial_sync_failed_try_again',
    UNKNOWN_SYNC_ERROR_WEBAPP: 'webapp_login_form_email_fieldset_error_initial_sync_failed_contact_cs'
};
interface MasterPasswordInputProps {
    error: string;
    hasError: boolean;
    onKeyDown: (e: React.FormEvent) => void;
    onPasswordInputChange: (value: string) => void;
    onTogglePasswordVisibility?: (visible: boolean) => void;
}
export const MasterPasswordInput = ({ error, hasError, onKeyDown, onPasswordInputChange, onTogglePasswordVisibility, }: MasterPasswordInputProps) => {
    const { translate } = useTranslate();
    const translateErrorMessage = () => {
        if (error === 'UNKNOWN_SYNC_ERROR') {
            if (APP_PACKAGED_IN_EXTENSION) {
                return translate(I18N_KEYS.UNKNOWN_SYNC_ERROR_EXTENSION);
            }
            return translate(I18N_KEYS.UNKNOWN_SYNC_ERROR_WEBAPP);
        }
        else {
            return translate(I18N_KEYS[error] ?? I18N_KEYS.UNKNOWN_ERROR);
        }
    };
    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onPasswordInputChange(e.target.value);
    };
    return (<PasswordInput autoFocus showPasswordTooltipText={translate(I18N_KEYS.SHOW_LABEL)} hidePasswordTooltipText={translate(I18N_KEYS.HIDE_LABEL)} placeholder={translate(I18N_KEYS.PLACEHOLDER)} label={translate(I18N_KEYS.LABEL)} onChange={handlePasswordInputChange} onKeyDown={onKeyDown} onPasswordVisibilityChanged={(visible: boolean) => onTogglePasswordVisibility?.(visible)} feedbackType={hasError ? 'error' : undefined} feedbackText={hasError ? translateErrorMessage() : undefined} spellCheck={false}/>);
};
