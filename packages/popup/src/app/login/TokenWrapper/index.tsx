import { FunctionComponent, memo, useEffect, useState } from 'react';
import OTPStep, { OTPStepProps } from 'app/login/AuthorizationStep/otp';
import useTranslate from 'libs/i18n/useTranslate';
import { colors, jsx, Link, Paragraph } from '@dashlane/ui-components';
import { logResendTokenEvent } from '../logs';
const ERROR_I18N_KEYS = {
    NETWORK_ERROR: 'login/security_code_error_network_error',
    TOKEN_NOT_VALID: 'login/security_code_error_otp_not_valid',
    TOKEN_LOCKED: 'login/security_code_error_token_locked',
    TOKEN_TOO_MANY_ATTEMPTS: 'login/security_code_error_token_too_many_attempts',
    TOKEN_ACCOUNT_LOCKED: 'login/security_code_error_token_locked',
    TOKEN_EXPIRED: 'login/security_code_error_token_expired',
    UNKNOWN_ERROR: 'login/security_code_error_otp_not_valid',
};
const I18N_KEYS = {
    CONTINUE: 'login/token_confirm_button',
    DESCRIPTION: 'login/token_description',
    RESEND_CODE: 'login/token_resend_code_button',
    RESEND_CODE_SUCCESS: 'login/token_resend_code_success_button',
    TITLE: 'login/token_label',
    USE_DASHLANE_AUTHENTICATOR_APP: 'login/dashlane_authenticator_use_authenticator_app_button',
    DIDNT_RECEIVE_CODE: 'login/token_didnt_receive_code',
};
export interface TokenStepWrapperProps {
    login: string;
    isLoading: boolean;
    setWaitingForResponseState: () => void;
    sendToken: (params: {
        login: string;
        token: string;
    }) => void;
    resendToken: (params: {
        login: string;
    }) => void;
    resetErrorState: () => void;
    error?: string;
    isDashlaneAuthenticatorAvailable: boolean;
    switchToDashlaneAuthenticatorStep: () => void;
}
const TokenWrapper: FunctionComponent<TokenStepWrapperProps> = (props: TokenStepWrapperProps) => {
    const { translate } = useTranslate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [codeValue, setCodeValue] = useState('');
    useEffect(() => {
        async function getToken() { }
    }, [props.login]);
    const handleTokenSubmit = (token: string) => {
        props.setWaitingForResponseState();
        props.sendToken({ login: props.login, token });
    };
    const onResendTokenClick = () => {
        logResendTokenEvent();
        setShowSuccessMessage(true);
        props.resendToken({ login: props.login });
    };
    const onInputFocus = () => {
        setShowSuccessMessage(false);
    };
    const resendTokenLink = (<div sx={{ marginTop: '24px', display: 'flex', alignItems: 'center' }}>
      <Paragraph sx={{ marginRight: '5px' }} color={colors.white}>
        {translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}
      </Paragraph>
      <Link onClick={() => props.resendToken({ login: props.login })} color={colors.white} hoverColor={colors.white} activeColor={colors.white}>
        {translate(I18N_KEYS.RESEND_CODE)}
      </Link>
    </div>);
    const showResendTokenLink = props.isDashlaneAuthenticatorAvailable;
    const otpStepProps: OTPStepProps = {
        error: props.error &&
            translate(props.error in ERROR_I18N_KEYS
                ? ERROR_I18N_KEYS[props.error as keyof typeof ERROR_I18N_KEYS]
                : ERROR_I18N_KEYS['UNKNOWN_ERROR']),
        titleCopy: translate(I18N_KEYS.TITLE),
        descriptionCopy: translate(I18N_KEYS.DESCRIPTION),
        handleCodeSubmit: handleTokenSubmit,
        resetErrorState: props.resetErrorState,
        onInputFocus: onInputFocus,
        formActionsProps: {
            isLoading: props.isLoading,
            primaryButtonText: translate(I18N_KEYS.CONTINUE),
            secondaryButtonText: props.isDashlaneAuthenticatorAvailable
                ? translate(I18N_KEYS.USE_DASHLANE_AUTHENTICATOR_APP)
                : showSuccessMessage
                    ? translate(I18N_KEYS.RESEND_CODE_SUCCESS)
                    : translate(I18N_KEYS.RESEND_CODE),
            onSecondaryButtonClick: props.isDashlaneAuthenticatorAvailable
                ? props.switchToDashlaneAuthenticatorStep
                : onResendTokenClick,
            showSuccessMessage,
        },
        formDetails: showResendTokenLink ? resendTokenLink : null,
        codeValue,
        setCodeValue,
    };
    return <OTPStep {...otpStepProps}/>;
};
export default memo(TokenWrapper);
