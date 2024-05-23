import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Button, Paragraph } from '@dashlane/design-system';
import { FlexContainer, Link } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import Animation from 'libs/dashlane-style/animation';
import successLottie from 'libs/assets/lottie-success.json';
import { EmailHeader, Header, Navigation, SecurityCodeInput, WebappLoginLayout, } from 'auth/login-panel/authentication-flow/components';
import { CONFIRM_TOKEN_RESENT_RESET_TIMEOUT, SECURITY_TOKEN_MAX_LENGTH, } from 'auth/login-panel/authentication-flow/constants';
import { Result } from '@dashlane/framework-types';
const I18N_KEYS = {
    HEADING: 'webapp_login_form_heading_log_in',
    LOG_IN: 'webapp_auth_panel_login',
    SECURITY_CODE_DESCRIPTION: 'webapp_login_form_password_fieldset_security_code_description',
    DIDNT_RECEIVE_CODE: 'webapp_dashlane_authenticator_authentication_didnt_receive_code',
    RESEND_TOKEN: 'webapp_login_form_password_fieldset_resend_token',
    SECURITY_CODE_RESENT: 'webapp_login_form_password_fieldset_security_code_resent',
};
const I18N_ERROR_KEYS = {
    EMPTY_TOKEN: 'webapp_login_form_password_fieldset_security_code_error_empty_token',
    TOKEN_NOT_VALID: 'webapp_login_form_password_fieldset_security_code_error_token_not_valid',
    REGISTER_DEVICE_FAILED: 'webapp_login_form_password_fieldset_security_code_error_token_not_valid',
    TOKEN_LOCKED: 'webapp_login_form_password_fieldset_security_code_error_token_locked',
    TOKEN_TOO_MANY_ATTEMPTS: 'webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts',
    TOKEN_ACCOUNT_LOCKED: 'webapp_login_form_password_fieldset_security_code_error_token_account_locked',
    TOKEN_EXPIRED: 'webapp_login_form_password_fieldset_security_code_error_token_expired',
    UNKNOWN_ERROR: 'webapp_login_form_password_fieldset_security_code_error_unkown',
    THROTTLED: 'webapp_login_form_password_fieldset_error_throttled',
    NETWORK_ERROR: 'webapp_login_form_password_fieldset_network_error_offline',
};
interface Props {
    login?: string;
    error?: string;
    isLoading?: boolean;
    sendEmailToken: (params: {
        emailToken: string;
    }) => Promise<Result<undefined>>;
}
export const EmailToken = ({ login, error, isLoading, sendEmailToken, }: Props) => {
    const { translate } = useTranslate();
    const [showConfirmTokenResent, setShowConfirmTokenResent] = useState(false);
    const handleTokenResent = () => {
        setShowConfirmTokenResent(true);
        setTimeout(() => {
            setShowConfirmTokenResent(false);
        }, CONFIRM_TOKEN_RESENT_RESET_TIMEOUT);
    };
    const { setFieldValue, handleSubmit, values: { emailToken }, } = useFormik({
        initialValues: {
            emailToken: '',
        },
        onSubmit: ({ emailToken }) => {
            sendEmailToken({ emailToken });
        },
    });
    const formatAuthenticatorCode = (value: string) => value.replace(/\D/g, '');
    const onTokenInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target: { value }, } = e;
        void setFieldValue('emailToken', formatAuthenticatorCode(value));
        if (value.length === SECURITY_TOKEN_MAX_LENGTH) {
            handleSubmit();
        }
    };
    return (<FlexContainer justifyContent="center" flexDirection="column">
      <Navigation />

      <WebappLoginLayout>
        <Header text={translate(I18N_KEYS.HEADING)}/>
        <EmailHeader selectedEmail={login}/>
        <form onSubmit={handleSubmit}>
          <SecurityCodeInput title={translate(I18N_KEYS.SECURITY_CODE_DESCRIPTION)} securityToken={emailToken} maxLength={SECURITY_TOKEN_MAX_LENGTH} onTokenInputChange={onTokenInputChange} errorMessage={error
            ? translate(I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR)
            : undefined}/>
          <Button type="submit" disabled={isLoading} isLoading={isLoading} fullsize style={{ marginTop: '16px', marginBottom: '24px' }}>
            {translate(I18N_KEYS.LOG_IN)}
          </Button>
        </form>
      </WebappLoginLayout>

      <FlexContainer alignItems="center" flexDirection="row">
        <div style={{ marginRight: '5px', display: 'flex', flexDirection: 'row' }}>
          <Paragraph style={{ marginRight: '5px' }}>
            {translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}
          </Paragraph>
          <Link onClick={handleTokenResent} color="ds.text.brand.quiet">
            {translate(I18N_KEYS.RESEND_TOKEN)}
          </Link>
        </div>
        {showConfirmTokenResent ? (<Animation height={18.5} width={18.5} animationParams={{
                renderer: 'svg',
                animationData: successLottie,
                loop: false,
                autoplay: true,
            }}/>) : null}
      </FlexContainer>
    </FlexContainer>);
};
