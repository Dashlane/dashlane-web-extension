import React, { useState } from 'react';
import classnames from 'classnames';
import { Dialog, Heading, Icon, jsx, Paragraph, PasswordField, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
import styles from './webauthn-dialog.css';
const I18N_KEYS = {
    TITLE: 'webapp_account_security_settings_passwordless_disable_title',
    DESC: 'webapp_account_security_settings_passwordless_disable_description',
    BUTTON_REMOVE: 'webapp_account_security_settings_passwordless_disable_button_remove',
    BUTTON_CANCEL: 'webapp_account_security_settings_passwordless_disable_button_cancel',
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
    INPUT_MASTER_PASSWORD: 'webapp_account_security_settings_passwordless_disable_master_password',
    INPUT_ERROR: 'webapp_account_security_settings_passwordless_disable_master_password_error',
    INPUT_PLACEHOLDER: 'webapp_account_security_settings_passwordless_disable_master_password_placeholder',
    INPUT_BUTTON_SHOW: 'webapp_account_security_settings_passwordless_disable_master_password_show',
    INPUT_BUTTON_HIDE: 'webapp_account_security_settings_passwordless_disable_master_password_hide',
};
enum ErrorTypes {
    WRONG_PASSWORD_ERROR = 'wrong_password'
}
interface DisableWebAuthnLastAuthenticatorDialogProps {
    onValidateMasterPassword: (masterPassword: string) => void;
    onRemoveAuthenticator: () => void;
    onDismiss: () => void;
}
export const DisableWebAuthnLastAuthenticatorDialog = ({ onValidateMasterPassword, onRemoveAuthenticator, onDismiss, }: DisableWebAuthnLastAuthenticatorDialogProps) => {
    const { translate } = useTranslate();
    const [currentPasswordValue, setCurrentPasswordValue] = useState('');
    const [currentPasswordErrorType, setCurrentPasswordErrorType] = useState<ErrorTypes.WRONG_PASSWORD_ERROR | null>(null);
    const validateMasterPassword = async (masterPassword: string): Promise<boolean> => {
        try {
            await onValidateMasterPassword(masterPassword);
            setCurrentPasswordErrorType(null);
            return true;
        }
        catch (e) {
            setCurrentPasswordErrorType(ErrorTypes.WRONG_PASSWORD_ERROR);
            return false;
        }
    };
    const handleCurrentPasswordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const current = event.target.value;
        setCurrentPasswordErrorType(null);
        setCurrentPasswordValue(current);
    };
    const onSubmit = async (event: React.SyntheticEvent<HTMLElement>) => {
        event.preventDefault();
        if (!currentPasswordValue) {
            return;
        }
        const isValid = await validateMasterPassword(currentPasswordValue);
        if (isValid) {
            await onRemoveAuthenticator();
            onDismiss();
        }
    };
    return (<Dialog title={''} isOpen onClose={onDismiss} actions={{
            primary: {
                children: translate(I18N_KEYS.BUTTON_REMOVE),
                disabled: !currentPasswordValue || currentPasswordErrorType !== null,
                onClick: onSubmit,
            },
            secondary: {
                children: translate(I18N_KEYS.BUTTON_CANCEL),
                onClick: onDismiss,
            },
        }} closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)} dialogClassName={classnames(allIgnoreClickOutsideClassName)} aria-describedby="disableDialogBody">
      <div className={styles.icon}>
        <Icon name="FeedbackFailOutlined" style={{ height: '62px', width: '62px' }} color="ds.text.danger.quiet"/>
      </div>

      <Heading as="h2">{translate(I18N_KEYS.TITLE)}</Heading>

      <Paragraph id="disableDialogBody" color="ds.text.neutral.quiet" sx={{ marginBottom: '18px' }}>
        {translate(I18N_KEYS.DESC)}
      </Paragraph>

      <form onSubmit={onSubmit}>
        <PasswordField label={translate(I18N_KEYS.INPUT_MASTER_PASSWORD)} onChange={handleCurrentPasswordChanged} toggleVisibilityLabel={{
            show: translate(I18N_KEYS.INPUT_BUTTON_SHOW),
            hide: translate(I18N_KEYS.INPUT_BUTTON_HIDE),
        }} placeholder={translate(I18N_KEYS.INPUT_PLACEHOLDER)} value={currentPasswordValue} error={currentPasswordErrorType === ErrorTypes.WRONG_PASSWORD_ERROR} feedback={{
            text: currentPasswordErrorType === ErrorTypes.WRONG_PASSWORD_ERROR
                ? translate(I18N_KEYS.INPUT_ERROR)
                : '',
        }}/>
      </form>
    </Dialog>);
};
