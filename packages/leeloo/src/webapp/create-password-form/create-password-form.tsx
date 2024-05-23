import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DialogFooter } from '@dashlane/ui-components';
import { jsx, PasswordField } from '@dashlane/design-system';
import { PasswordStrengthTooltip } from 'account/creation/confirm/password-strength-tooltip';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { ZXCVBN_SCORE_TRANSLATION_MAPPING } from 'libs/password-evaluation/helpers';
import { usePasswordStrength } from 'libs/password-evaluation/usePasswordStrength';
import styles from './create-password-form.css';
export interface Props {
    createPasswordInputLabel?: string;
    createPasswordPlaceholderLabel?: string;
    confirmPasswordInputLabel?: string;
    confirmPasswordPlaceholderLabel?: string;
    primaryButtonTitle?: string;
    secondaryButtonTitle?: string;
    onSubmit: (options: string) => void;
    onDismiss: () => void;
}
enum ErrorTypes {
    PASSWORDS_DONT_MATCH_ERROR = 'passwords_dont_match',
    WEAK_PASSWORD_ERROR = 'weak_password'
}
const I18N_KEYS = {
    CONFIRM_PASSWORD_FLOATING_LABEL: 'webapp_sso_to_mp_confirm_password_floating_label',
    CONFIRM_PASSWORD_HIDE_LABEL: 'webapp_sso_to_mp_confirm_password_hide_label',
    CONFIRM_PASSWORD_HINT_TEXT: 'webapp_sso_to_mp_confirm_password_hint_text',
    CONFIRM_PASSWORD_SHOW_LABEL: 'webapp_sso_to_mp_confirm_password_show_label',
    CREATE_PASSWORD_BUTTON: 'webapp_sso_to_mp_create_password_button',
    CREATE_PASSWORD_FLOATING_LABEL: 'webapp_sso_to_mp_create_password_floating_label',
    CREATE_PASSWORD_HEADER: 'webapp_sso_to_mp_confirm_create_your_password',
    CREATE_PASSWORD_HIDE_LABEL: 'webapp_sso_to_mp_password_hide_label',
    CREATE_PASSWORD_HINT_TEXT: 'webapp_sso_to_mp_password_hint_text',
    CREATE_PASSWORD_SHOW_LABEL: 'webapp_sso_to_mp_password_show_label',
    ERROR_WEAK_PASSWORD: 'webapp_sso_to_mp_error_weak_password',
    ERROR_PASSWORDS_DONT_MATCH: 'webapp_sso_to_mp_error_passwords_dont_match',
};
export const CreatePasswordForm = ({ createPasswordInputLabel, createPasswordPlaceholderLabel, confirmPasswordInputLabel, confirmPasswordPlaceholderLabel, primaryButtonTitle, secondaryButtonTitle, onSubmit, onDismiss, }: Props) => {
    const { translate } = useTranslate();
    const [createPasswordValue, setCreatePasswordValue] = React.useState('');
    const [createPasswordErrorType, setCreatePasswordErrorType] = React.useState<ErrorTypes.WEAK_PASSWORD_ERROR | null>(null);
    const [isCreatePasswordFocused, setIsCreatePasswordFocused] = React.useState(true);
    const [confirmPasswordValue, setConfirmPasswordValue] = React.useState('');
    const [confirmPasswordErrorType, setConfirmPasswordErrorType] = React.useState<ErrorTypes.PASSWORDS_DONT_MATCH_ERROR | null>(null);
    const { passwordStrength, resetPasswordStrength, setPasswordStrength, isPasswordStrongEnough, } = usePasswordStrength();
    const [isLoading, setIsLoading] = React.useState(false);
    const passwordFieldId = uuidv4();
    const handleCreatePasswordFocused = () => {
        setIsCreatePasswordFocused(true);
    };
    const handleCreatePasswordChanged = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value;
        setCreatePasswordValue(password);
        if (createPasswordErrorType) {
            setCreatePasswordErrorType(null);
        }
        if (confirmPasswordErrorType) {
            setConfirmPasswordErrorType(null);
        }
        if (password === '') {
            resetPasswordStrength();
        }
        const currentPasswordStrength = await carbonConnector.evaluatePassword({
            password,
        });
        setPasswordStrength(currentPasswordStrength);
    };
    const handleConfirmPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPasswordValue(event.target.value);
        setConfirmPasswordErrorType(null);
    };
    const getPasswordErrorText = (passwordErrorType: ErrorTypes | null) => {
        if (!passwordErrorType) {
            return undefined;
        }
        if (passwordErrorType === ErrorTypes.WEAK_PASSWORD_ERROR) {
            return translate(I18N_KEYS.ERROR_WEAK_PASSWORD);
        }
        else {
            return translate(I18N_KEYS.ERROR_PASSWORDS_DONT_MATCH);
        }
    };
    const isDisabled = () => {
        const isEmptyPasswords = !createPasswordValue || !confirmPasswordValue;
        const isSamePassword = confirmPasswordValue === createPasswordValue;
        return (isEmptyPasswords ||
            !isSamePassword ||
            !isPasswordStrongEnough ||
            isLoading);
    };
    const handleConfirmFormSubmitted = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isDisabled()) {
            return;
        }
        if (createPasswordValue !== confirmPasswordValue) {
            setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
            return;
        }
        setIsLoading(true);
        await onSubmit(createPasswordValue);
        setIsLoading(false);
    };
    const handleCreatePasswordBlurred = () => {
        const isValid = !createPasswordValue || isPasswordStrongEnough;
        const shouldDisplayMismatchingPasswordsError = createPasswordValue &&
            confirmPasswordValue &&
            createPasswordValue !== confirmPasswordValue;
        setCreatePasswordErrorType(isValid ? null : ErrorTypes.WEAK_PASSWORD_ERROR);
        setIsCreatePasswordFocused(false);
        setConfirmPasswordErrorType(shouldDisplayMismatchingPasswordsError
            ? ErrorTypes.PASSWORDS_DONT_MATCH_ERROR
            : null);
    };
    const handleConfirmPasswordBlurred = () => {
        if (confirmPasswordValue && createPasswordValue !== confirmPasswordValue) {
            setConfirmPasswordErrorType(ErrorTypes.PASSWORDS_DONT_MATCH_ERROR);
        }
    };
    return (<form style={{ width: '100%' }} autoComplete="off" noValidate={true} onSubmit={handleConfirmFormSubmitted}>
      <div className={styles.inputContainer}>
        <div className={styles.createPasswordContainer}>
          <PasswordStrengthTooltip id="password-tooltip" passwordStrength={passwordStrength} showTooltip={isCreatePasswordFocused}>
            <PasswordField toggleVisibilityLabel={{
            show: translate(I18N_KEYS.CREATE_PASSWORD_SHOW_LABEL),
            hide: translate(I18N_KEYS.CREATE_PASSWORD_HIDE_LABEL),
        }} onBlur={handleCreatePasswordBlurred} onFocus={handleCreatePasswordFocused} onChange={handleCreatePasswordChanged} placeholder={createPasswordPlaceholderLabel
            ? createPasswordPlaceholderLabel
            : translate(I18N_KEYS.CREATE_PASSWORD_HINT_TEXT)} value={createPasswordValue} label={createPasswordInputLabel
            ? createPasswordInputLabel
            : translate(I18N_KEYS.CREATE_PASSWORD_FLOATING_LABEL)} error={!!createPasswordErrorType} feedback={createPasswordErrorType
            ? {
                text: getPasswordErrorText(createPasswordErrorType) ?? '',
            }
            : undefined} passwordStrength={passwordStrength
            ? {
                descriptionId: passwordFieldId,
                score: passwordStrength.score,
                description: translate(`account_creation_${ZXCVBN_SCORE_TRANSLATION_MAPPING[passwordStrength.score]}`),
            }
            : undefined} aria-describedby={passwordFieldId}/>
          </PasswordStrengthTooltip>
        </div>
        <PasswordField value={confirmPasswordValue} toggleVisibilityLabel={{
            show: translate(I18N_KEYS.CONFIRM_PASSWORD_SHOW_LABEL),
            hide: translate(I18N_KEYS.CONFIRM_PASSWORD_HIDE_LABEL),
        }} placeholder={confirmPasswordPlaceholderLabel
            ? confirmPasswordPlaceholderLabel
            : translate(I18N_KEYS.CONFIRM_PASSWORD_HINT_TEXT)} onBlur={handleConfirmPasswordBlurred} onChange={handleConfirmPasswordChanged} label={confirmPasswordInputLabel
            ? confirmPasswordInputLabel
            : translate(I18N_KEYS.CONFIRM_PASSWORD_FLOATING_LABEL)} feedback={confirmPasswordErrorType
            ? {
                text: getPasswordErrorText(confirmPasswordErrorType) ?? '',
            }
            : undefined} error={!!confirmPasswordErrorType}/>
      </div>
      <DialogFooter primaryButtonTitle={primaryButtonTitle
            ? primaryButtonTitle
            : translate(I18N_KEYS.CREATE_PASSWORD_BUTTON)} primaryButtonProps={{ disabled: isDisabled(), type: 'submit' }} secondaryButtonTitle={secondaryButtonTitle ? secondaryButtonTitle : null} secondaryButtonOnClick={onDismiss}/>
    </form>);
};
