import { TwoFactorAuthenticationError } from "@dashlane/hermes";
import { AuthenticationCode } from "@dashlane/communication";
import { getTwoFactorAuthenticationOtpError } from "./get-two-factor-authentication-otp-error";
import { TwoFactorAuthenticationErrorLog } from "../types";
const I18N_KEYS = {
  GENERIC_ERROR:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_generic_error",
  NETWORK_ERROR: "_common_alert_network_error_message",
  BAKCUP_CODE_NOT_VALID_ERROR:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_invalid_security_code",
  TWO_FACTOR_AUTHENTICATION_DISABLE_SUCCESS_ALERT:
    "webapp_account_security_settings_disable_success",
  CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
export const getTwoFactorAuthenticationCodeLogError = (
  errorCode: string | AuthenticationCode
): TwoFactorAuthenticationErrorLog => {
  const otpError = getTwoFactorAuthenticationOtpError(errorCode);
  if (otpError) {
    return otpError as TwoFactorAuthenticationErrorLog;
  } else if (errorCode === AuthenticationCode.BACKUP_CODE_NOT_VALID) {
    return {
      logErrorName: TwoFactorAuthenticationError.WrongBackupCodeError,
      errorMessage: I18N_KEYS.BAKCUP_CODE_NOT_VALID_ERROR,
    };
  } else if (errorCode === AuthenticationCode.NETWORK_ERROR) {
    return {
      logErrorName: TwoFactorAuthenticationError.UnknownError,
      errorMessage: I18N_KEYS.NETWORK_ERROR,
    };
  } else if (self.navigator?.onLine) {
    return {
      logErrorName: TwoFactorAuthenticationError.UnknownError,
      errorMessage: I18N_KEYS.GENERIC_ERROR,
    };
  } else {
    return {
      logErrorName: TwoFactorAuthenticationError.UserOfflineError,
      errorMessage: I18N_KEYS.NETWORK_ERROR,
    };
  }
};
