import React, { useRef } from 'react';
import { useFormik } from 'formik';
import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { Button, jsx, Paragraph, TextField } from '@dashlane/design-system';
import { Result } from '@dashlane/framework-types';
import { Link } from '@dashlane/ui-components';
import { EmailHeader, Header, WebappLoginLayout, } from 'auth/login-panel/authentication-flow/components';
import useTranslate from 'libs/i18n/useTranslate';
import { NavLink, useRouterGlobalSettingsContext } from 'libs/router';
const I18N_KEYS = {
    HEADING: 'webapp_account_security_settings_two_factor_authentication_backup_code_title',
    LOG_IN: 'webapp_auth_panel_login',
    SECURITY_CODE_BACKUP_CODE_LABEL: 'webapp_two_factor_authentication_backup_code_label',
    SECURITY_CODE_BACKUP_CODE_DESCRIPTION: 'webapp_two_factor_authentication_use_backup_codes',
    SECURITY_CODE_LINK: 'webapp_two_factor_authentication_use_6_digits_code',
    SECURITY_CODE_CANT_ACCESS_BACKUP_CODES: 'webapp_two_factor_authentication_cant_access_your_backup_codes',
    SECURITY_CODE_LOST_BACKUP_CODES: 'webapp_two_factor_authentication_lost_your_backup_codes',
    SECURITY_CODE_LOST_PHONE_LINK: 'webapp_two_factor_authentication_reset_2fa',
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
interface Props extends Omit<AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpView, 'step'> {
    submitBackupCode: (params: {
        twoFactorAuthenticationOtpValue: string;
    }) => Promise<Result<undefined>>;
    changeTwoFactorAuthenticationOtpType: (params: {
        twoFactorAuthenticationOtpType: AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpType;
    }) => Promise<Result<undefined>>;
}
const paragraphStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    lineHeight: '20px',
};
export const AccountBackupCode = ({ loginEmail, error, isLoading, changeTwoFactorAuthenticationOtpType, submitBackupCode, }: Props) => {
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
    return (<WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)}/>
      <EmailHeader selectedEmail={loginEmail}/>
      <form onSubmit={handleSubmit}>
        <Paragraph color="ds.text.neutral.quiet" sx={{ marginBottom: '16px' }}>
          {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_DESCRIPTION)}
        </Paragraph>
        <TextField value={twoFactorAuthenticationOtpValue} label={translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LABEL)} onChange={onTokenInputChange} error={!!error} ref={inputRef} feedback={error
            ? {
                id: 'login-feedback-text',
                text: translate(I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR),
            }
            : undefined} autoFocus data-testid="auth-backup-code-input"/>
        <Paragraph color="ds.text.neutral.quiet" sx={{
            ...paragraphStyle,
            margin: '16px 0 8px 0',
        }}>
          {translate(I18N_KEYS.SECURITY_CODE_CANT_ACCESS_BACKUP_CODES)}
          <Link color="ds.text.brand.standard" onClick={() => changeTwoFactorAuthenticationOtpType({
            twoFactorAuthenticationOtpType: 'totp',
        })} target="_self">
            {translate(I18N_KEYS.SECURITY_CODE_LINK)}
          </Link>
        </Paragraph>
        <Paragraph color="ds.text.neutral.quiet" sx={{
            ...paragraphStyle,
            margin: '8px 0',
        }}>
          {translate(I18N_KEYS.SECURITY_CODE_LOST_BACKUP_CODES)}
          <NavLink color="ds.text.brand.standard" to={routes.recover2faCodes(loginEmail)} target="_blank" rel="noopener noreferrer">
            {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
          </NavLink>
        </Paragraph>
        <Button type="submit" isLoading={isLoading} data-testid="submitBackupCode" fullsize size="large" sx={{ marginTop: '16px' }}>
          {translate(I18N_KEYS.LOG_IN)}
        </Button>
      </form>
    </WebappLoginLayout>);
};
