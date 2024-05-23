import { TwoFactorAuthenticationError } from '@dashlane/hermes';
import { AuthenticationCode } from '@dashlane/communication';
import { TwoFactorAuthenticationErrorLog } from '../types';
export const I18N_KEYS_2FA_ERRORS = {
    OTP_NOT_VALID: 'webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_invalid_security_code',
    OTP_ALREADY_USED: 'webapp_login_form_password_fieldset_security_code_error_otp_already_used',
    OTP_TOO_MANY_ATTEMPTS: 'webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts',
};
export const getTwoFactorAuthenticationOtpError = (errorCode: string | AuthenticationCode): TwoFactorAuthenticationErrorLog | undefined => {
    switch (errorCode) {
        case AuthenticationCode.OTP_NOT_VALID:
            return {
                logErrorName: TwoFactorAuthenticationError.WrongCodeError,
                errorMessage: I18N_KEYS_2FA_ERRORS.OTP_NOT_VALID,
            };
        case AuthenticationCode.OTP_ALREADY_USED:
            return {
                logErrorName: TwoFactorAuthenticationError.WrongCodeError,
                errorMessage: I18N_KEYS_2FA_ERRORS.OTP_ALREADY_USED,
            };
        case AuthenticationCode.OTP_TOO_MANY_ATTEMPTS:
            return {
                logErrorName: TwoFactorAuthenticationError.UnknownError,
                errorMessage: I18N_KEYS_2FA_ERRORS.OTP_TOO_MANY_ATTEMPTS,
            };
        default:
            return undefined;
    }
};
