import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { IdentityVerificationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, jsx, TextField } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import { FlowStep, UserUseAccountRecoveryKeyEvent } from '@dashlane/hermes';
import { FlexContainer, Link, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { NavLink, redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { logEvent } from 'libs/logs/logEvent';
import { LOGIN_URL_SEGMENT } from 'app/routes/constants';
const I18N_KEYS = {
    LOG_IN: 'webapp_auth_panel_login',
    SECURITY_CODE_BACKUP_CODE_LABEL: 'webapp_two_factor_authentication_backup_code_label',
    SECURITY_CODE_BACKUP_CODE_DESCRIPTION: 'webapp_two_factor_authentication_use_backup_codes',
    SECURITY_CODE_LINK: 'webapp_two_factor_authentication_use_6_digits_code',
    SECURITY_CODE_CANT_ACCESS_BACKUP_CODES: 'webapp_two_factor_authentication_cant_access_your_backup_codes',
    SECURITY_CODE_LOST_BACKUP_CODES: 'webapp_two_factor_authentication_lost_your_backup_codes',
    SECURITY_CODE_LOST_PHONE_LINK: 'webapp_two_factor_authentication_reset_2fa',
    VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON: 'login_verify_your_identity_step_button',
    VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON: '_common_action_cancel',
};
const I18N_ERROR_KEYS = {
    EMPTY_OTP: 'webapp_login_form_password_fieldset_security_code_error_otp_not_valid',
    EMPTY_TOKEN: 'webapp_login_form_password_fieldset_security_code_error_empty_token',
    TOKEN_NOT_VALID: 'webapp_login_form_password_fieldset_security_code_error_token_not_valid',
    TOKEN_LOCKED: 'webapp_login_form_password_fieldset_security_code_error_token_locked',
    TOKEN_TOO_MANY_ATTEMPTS: 'webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts',
    TOKEN_ACCOUNT_LOCKED: 'webapp_login_form_password_fieldset_security_code_error_token_account_locked',
    TOKEN_EXPIRED: 'webapp_login_form_password_fieldset_security_code_error_token_expired',
    UNKNOWN_ERROR: 'webapp_login_form_password_fieldset_security_code_error_unkown',
    THROTTLED: 'webapp_login_form_password_fieldset_error_throttled',
    NETWORK_ERROR: 'webapp_login_form_password_fieldset_network_error_offline',
};
interface Props extends Pick<IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpView, 'error' | 'isLoading'> {
    submitBackupCode: (params: {
        twoFactorAuthenticationOtpValue: string;
    }) => Promise<Result<undefined>>;
    changeTwoFactorAuthenticationOtpType: (params: {
        twoFactorAuthenticationOtpType: IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpType;
    }) => Promise<Result<undefined>>;
    cancelAccountRecoveryKey: () => Promise<Result<undefined>>;
    login: string;
}
const paragraphStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    lineHeight: '20px',
};
export const AccountBackupCode = ({ error, isLoading, submitBackupCode, changeTwoFactorAuthenticationOtpType, cancelAccountRecoveryKey, login, }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const inputRef = useRef<HTMLInputElement>(null);
    const { setFieldValue, handleSubmit, values: { twoFactorAuthenticationOtpValue }, } = useFormik({
        initialValues: {
            twoFactorAuthenticationOtpValue: '',
        },
        onSubmit: ({ twoFactorAuthenticationOtpValue }) => {
            submitBackupCode({
                twoFactorAuthenticationOtpValue,
            });
            inputRef.current?.focus();
        },
    });
    const onTokenInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { value }, } = e;
        void setFieldValue('twoFactorAuthenticationOtpValue', value);
    };
    const handleCancel = () => {
        void cancelAccountRecoveryKey();
        logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
        redirect(LOGIN_URL_SEGMENT);
    };
    return (<form onSubmit={handleSubmit}>
      <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '16px' }}>
        {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_DESCRIPTION)}
      </Paragraph>

      <TextField value={twoFactorAuthenticationOtpValue} label={translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LABEL)} onChange={onTokenInputChange} error={!!error} ref={inputRef} feedback={error
            ? {
                id: 'login-feedback-text',
                text: translate(I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR),
            }
            : undefined} autoFocus/>

      <FlexContainer flexDirection="row" sx={{ margin: '24px 0px 16px' }}>
        <Paragraph color="ds.text.neutral.quiet" sx={{
            ...paragraphStyle,
            marginRight: '4px',
        }}>
          {translate(I18N_KEYS.SECURITY_CODE_CANT_ACCESS_BACKUP_CODES)}
        </Paragraph>
        <Link onClick={() => changeTwoFactorAuthenticationOtpType({
            twoFactorAuthenticationOtpType: 'totp',
        })} target="_self" color="ds.text.brand.quiet">
          {translate(I18N_KEYS.SECURITY_CODE_LINK)}
        </Link>
      </FlexContainer>

      <FlexContainer flexDirection="row">
        <Paragraph color="ds.text.neutral.quiet" sx={{
            ...paragraphStyle,
            marginRight: '4px',
        }}>
          {translate(I18N_KEYS.SECURITY_CODE_LOST_BACKUP_CODES)}
        </Paragraph>
        <NavLink to={routes.recover2faCodes(login)} target="_blank" rel="noopener noreferrer" color="ds.text.brand.standard">
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
        </NavLink>
      </FlexContainer>

      <div sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: '40px',
        }}>
        <Button id="cancel-button" data-testid="cancel-button" mood="neutral" intensity="quiet" sx={{ marginRight: '16px' }} onClick={handleCancel}>
          {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON)}
        </Button>
        <Button type="submit" isLoading={isLoading} data-testid="submitBackupCode">
          {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON)}
        </Button>
      </div>
    </form>);
};
