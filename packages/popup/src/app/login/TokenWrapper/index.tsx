import { FunctionComponent, memo, useEffect, useState } from "react";
import OTPStep, { OTPStepProps } from "../AuthorizationStep/otp";
import useTranslate from "../../../libs/i18n/useTranslate";
import { colors, jsx, Link, Paragraph } from "@dashlane/ui-components";
import { logResendTokenEvent } from "../logs";
const ERROR_I18N_KEYS = {
  NETWORK_ERROR: "login/security_code_error_network_error",
  TOKEN_NOT_VALID: "login/security_code_error_otp_not_valid",
  TOKEN_LOCKED: "login/security_code_error_token_locked",
  TOKEN_TOO_MANY_ATTEMPTS: "login/security_code_error_token_too_many_attempts",
  TOKEN_ACCOUNT_LOCKED: "login/security_code_error_token_locked",
  TOKEN_EXPIRED: "login/security_code_error_token_expired",
  UNKNOWN_ERROR: "login/security_code_error_otp_not_valid",
};
const I18N_KEYS = {
  CONTINUE: "login/token_confirm_button",
  DESCRIPTION: "login/token_description",
  RESEND_CODE: "login/token_resend_code_button",
  RESEND_CODE_SUCCESS: "login/token_resend_code_success_button",
  TITLE: "login/token_label",
  USE_DASHLANE_AUTHENTICATOR_APP:
    "login/dashlane_authenticator_use_authenticator_app_button",
  DIDNT_RECEIVE_CODE: "login/token_didnt_receive_code",
};
export interface TokenStepWrapperProps {
  login: string;
  isLoading: boolean;
  setWaitingForResponseState: () => void;
  sendToken: (params: { login: string; token: string }) => void;
  resendToken: (params: { login: string }) => void;
  resetErrorState: () => void;
  error?: string;
  isDashlaneAuthenticatorAvailable: boolean;
  switchToDashlaneAuthenticatorStep: () => void;
}
export default memo(TokenWrapper);
