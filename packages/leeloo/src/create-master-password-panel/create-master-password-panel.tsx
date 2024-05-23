import React from 'react';
import { Lee } from 'lee';
import { Link as RouterLink } from 'libs/router';
import { BackIcon, Button, colors, FlexContainer, Heading, HelpIcon, jsx, Link, LoadingIcon, Paragraph, PasswordInput, PasswordStrength, } from '@dashlane/ui-components';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { PasswordStrengthTooltip } from 'account/creation/confirm/password-strength-tooltip';
import { TranslatorInterface } from 'libs/i18n/types';
import useTranslate from 'libs/i18n/useTranslate';
import { carbonConnector } from 'libs/carbon/connector';
import { ZXCVBN_SCORE_TRANSLATION_MAPPING } from 'libs/password-evaluation/helpers';
import { usePasswordStrength } from 'libs/password-evaluation/usePasswordStrength';
import { PasswordTipsDialog } from 'create-master-password-panel/password-tips-dialog/password-tips-dialog';
import { LogOutContainer } from 'log-out-container/log-out-container';
import styles from './create-master-password-panel.css';
export interface ConfirmNewPassword {
    password: string;
}
interface Props {
    dispatchGlobal: Lee['dispatchGlobal'];
    onSubmit: (options: ConfirmNewPassword | string) => Promise<void>;
    createMPForAccountRecovery?: boolean;
    showCreateMasterPasswordError?: string;
}
enum ErrorTypes {
    PASSWORDS_DONT_MATCH_ERROR = 'passwords_dont_match',
    WEAK_PASSWORD_ERROR = 'weak_password'
}
const I18N_KEYS = {
    BACK_TO_LOGIN_LABEL: 'webapp_account_recovery_back_to_login',
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
    NEED_HELP: 'webapp_sso_to_mp_need_help',
    PREVIOUS_STEP: 'webapp_account_recovery_previous_step',
};
export const CreateMasterPasswordPanel = ({ dispatchGlobal, onSubmit, createMPForAccountRecovery, showCreateMasterPasswordError, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const [showPasswordTips, setShowPasswordTips] = React.useState(false);
    const [createPasswordValue, setCreatePasswordValue] = React.useState('');
    const [createPasswordErrorType, setCreatePasswordErrorType] = React.useState<ErrorTypes.WEAK_PASSWORD_ERROR | null>(null);
    const [isCreatePasswordFocused, setIsCreatePasswordFocused] = React.useState(true);
    const [confirmPasswordValue, setConfirmPasswordValue] = React.useState('');
    const [confirmPasswordErrorType, setConfirmPasswordErrorType] = React.useState<ErrorTypes.PASSWORDS_DONT_MATCH_ERROR | null>(null);
    const { passwordStrength, resetPasswordStrength, setPasswordStrength, isPasswordStrengthScore, isPasswordStrongEnough, } = usePasswordStrength();
    const [isLoading, setIsLoading] = React.useState(false);
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
    const getPasswordErrorText = (passwordErrorType: ErrorTypes | null, translate: TranslatorInterface) => {
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
        if (!createMPForAccountRecovery) {
            await onSubmit({
                password: createPasswordValue,
            });
        }
        else {
            await onSubmit(createPasswordValue);
        }
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
    return (<div className={styles.createPasswordPanelContainer}>
      <PasswordTipsDialog showPasswordTipsDialog={showPasswordTips} handleDismiss={() => {
            setShowPasswordTips(false);
        }}/>
      <div className={styles.content}>
        <LogOutContainer dispatchGlobal={dispatchGlobal}/>
        <div className={styles.inner}>
          <Heading sx={{ marginBottom: '16px' }}>
            {translate(I18N_KEYS.CREATE_PASSWORD_HEADER)}
          </Heading>

          <FlexContainer sx={{ marginBottom: '40px' }}>
            <HelpIcon />
            <Link sx={{ marginLeft: '5px' }} onClick={() => {
            setShowPasswordTips(true);
        }}>
              <Paragraph bold={true} color={colors.midGreen00}>
                {translate(I18N_KEYS.NEED_HELP)}
              </Paragraph>
            </Link>
          </FlexContainer>

          <form className={styles.form} autoComplete="off" noValidate={true} onSubmit={handleConfirmFormSubmitted}>
            <div className={styles.createPasswordContainer}>
              <PasswordStrengthTooltip id="password-tooltip" passwordStrength={passwordStrength} showTooltip={isCreatePasswordFocused}>
                
                <PasswordInput showPasswordTooltipText={translate(I18N_KEYS.CREATE_PASSWORD_SHOW_LABEL)} hidePasswordTooltipText={translate(I18N_KEYS.CREATE_PASSWORD_HIDE_LABEL)} onBlur={handleCreatePasswordBlurred} onFocus={handleCreatePasswordFocused} onChange={handleCreatePasswordChanged} placeholder={translate(I18N_KEYS.CREATE_PASSWORD_HINT_TEXT)} value={createPasswordValue} label={translate(I18N_KEYS.CREATE_PASSWORD_FLOATING_LABEL)} feedbackType={createPasswordErrorType ? 'error' : undefined} feedbackText={createPasswordErrorType
            ? getPasswordErrorText(createPasswordErrorType, translate)
            : ''}/>
              </PasswordStrengthTooltip>
              {passwordStrength &&
            isPasswordStrengthScore(passwordStrength.score) && (<PasswordStrength score={passwordStrength.score} showAdditionalText additionalText={translate(`account_creation_${ZXCVBN_SCORE_TRANSLATION_MAPPING[passwordStrength.score]}`)}/>)}
            </div>
            <PasswordInput value={confirmPasswordValue} showPasswordTooltipText={translate(I18N_KEYS.CONFIRM_PASSWORD_SHOW_LABEL)} hidePasswordTooltipText={translate(I18N_KEYS.CONFIRM_PASSWORD_HIDE_LABEL)} placeholder={translate(I18N_KEYS.CONFIRM_PASSWORD_HINT_TEXT)} onBlur={handleConfirmPasswordBlurred} onChange={handleConfirmPasswordChanged} label={translate(I18N_KEYS.CONFIRM_PASSWORD_FLOATING_LABEL)} feedbackType={confirmPasswordErrorType ? 'error' : undefined} feedbackText={confirmPasswordErrorType
            ? getPasswordErrorText(confirmPasswordErrorType, translate)
            : ''}/>

            <FlexContainer className={styles.formAction}>
              {createMPForAccountRecovery ? (<RouterLink className={styles.previousStepContainer} to={routes.userDeviceRegistration} replace>
                  <BackIcon size={14}/>
                  <Paragraph sx={{ paddingLeft: '10px' }}>
                    {translate(I18N_KEYS.PREVIOUS_STEP)}
                  </Paragraph>
                </RouterLink>) : null}

              <Button type="submit" size="large" disabled={isDisabled()} className={styles.nextButton}>
                {isLoading ? (<LoadingIcon />) : (translate(I18N_KEYS.CREATE_PASSWORD_BUTTON))}
              </Button>
            </FlexContainer>
            {showCreateMasterPasswordError &&
            I18N_KEYS[showCreateMasterPasswordError] ? (<div className={styles.errorText}>
                {I18N_KEYS[showCreateMasterPasswordError]}
              </div>) : null}
          </form>
        </div>
      </div>
    </div>);
};
