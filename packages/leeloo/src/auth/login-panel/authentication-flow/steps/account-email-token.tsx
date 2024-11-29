import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { device } from "@dashlane/browser-utils";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { Button, LinkButton, Paragraph } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { PageView, UserResendTokenEvent } from "@dashlane/hermes";
import { Result } from "@dashlane/framework-types";
import {
  CONFIRM_TOKEN_RESENT_RESET_TIMEOUT,
  SECURITY_TOKEN_MAX_LENGTH,
} from "../constants";
import {
  EmailHeader,
  Header,
  SecurityCodeInput,
  WebappLoginLayout,
} from "../components";
import successLottie from "../../../../libs/assets/lottie-success.json";
import Animation from "../../../../libs/dashlane-style/animation";
import { logEvent } from "../../../../libs/logs/logEvent";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  HEADING: "webapp_login_form_heading_log_in",
  LOG_IN: "webapp_auth_panel_login",
  SECURITY_CODE_DESCRIPTION:
    "webapp_login_form_password_fieldset_security_code_description",
  DIDNT_RECEIVE_CODE:
    "webapp_dashlane_authenticator_authentication_didnt_receive_code",
  RESEND_TOKEN: "webapp_login_form_password_fieldset_resend_token",
  TOKEN_RESENT_CONFIRMATION:
    "webapp_login_form_password_fieldset_security_code_resent",
  CANT_ACCESS_EMAIL:
    "webapp_dashlane_authenticator_authentication_cant_access_your_email",
  USE_DASHLANE_AUTHENTICATOR_APP:
    "webapp_dashlane_authenticator_authentication_use_dashlane_authenticator_app",
};
const I18N_ERROR_KEYS = {
  EMPTY_TOKEN:
    "webapp_login_form_password_fieldset_security_code_error_empty_token",
  TOKEN_NOT_VALID:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_invalid_security_code",
  REGISTER_DEVICE_FAILED:
    "webapp_login_form_password_fieldset_security_code_error_token_not_valid",
  TOKEN_LOCKED:
    "webapp_login_form_password_fieldset_security_code_error_token_locked",
  TOKEN_TOO_MANY_ATTEMPTS:
    "webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts",
  TOKEN_ACCOUNT_LOCKED:
    "webapp_login_form_password_fieldset_security_code_error_token_account_locked",
  TOKEN_EXPIRED:
    "webapp_login_form_password_fieldset_security_code_error_token_expired",
  UNKNOWN_ERROR:
    "webapp_login_form_password_fieldset_security_code_error_unkown",
  THROTTLED: "webapp_login_form_password_fieldset_error_throttled",
  NETWORK_ERROR: "webapp_login_form_password_fieldset_network_error_offline",
};
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowEmailTokenView,
    "step"
  > {
  resendEmailToken: () => Promise<Result<undefined>>;
  switchToDashlaneAuthenticator: () => Promise<Result<undefined>>;
  submitEmailToken: (params: {
    emailToken: string;
    deviceName: string;
  }) => Promise<Result<undefined>>;
  clearInputError: () => void;
  prefilledToken?: string;
  onClearPrefilledToken: () => void;
}
export const AccountEmailToken = ({
  loginEmail,
  error,
  isLoading,
  isDashlaneAuthenticatorAvailable,
  resendEmailToken,
  switchToDashlaneAuthenticator,
  submitEmailToken,
  clearInputError,
  prefilledToken,
  onClearPrefilledToken,
}: Props) => {
  const { translate } = useTranslate();
  const EMAIL_TOKEN_MINIMAL_LENGTH = 6;
  const [showConfirmTokenResent, setShowConfirmTokenResent] = useState(false);
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginTokenEmail,
    });
  }, []);
  useEffect(() => {
    if (prefilledToken) {
      onClearPrefilledToken();
      submitEmailToken({
        emailToken: prefilledToken,
        deviceName: device.getDefaultDeviceName(),
      });
    }
  }, [prefilledToken]);
  const logUserResendTokenEvent = () => {
    void logEvent(new UserResendTokenEvent({}));
  };
  const handleTokenResent = () => {
    logUserResendTokenEvent();
    resendEmailToken();
    setShowConfirmTokenResent(true);
    setTimeout(() => {
      setShowConfirmTokenResent(false);
    }, CONFIRM_TOKEN_RESENT_RESET_TIMEOUT);
  };
  const handleSwicthToDashlaneAuthenticator = () => {
    switchToDashlaneAuthenticator();
  };
  const {
    setFieldValue,
    handleSubmit,
    values: { emailToken },
  } = useFormik({
    initialValues: {
      emailToken: "",
    },
    onSubmit: ({ emailToken }) => {
      submitEmailToken({
        emailToken,
        deviceName: device.getDefaultDeviceName(),
      });
    },
  });
  const formatAuthenticatorCode = (value: string) => value.replace(/\D/g, "");
  const onTokenInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value },
    } = e;
    clearInputError();
    void setFieldValue("emailToken", formatAuthenticatorCode(value));
    if (value.length === SECURITY_TOKEN_MAX_LENGTH) {
      handleSubmit();
    }
  };
  return (
    <WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)} />
      <EmailHeader selectedEmail={loginEmail} />

      <form onSubmit={handleSubmit}>
        <SecurityCodeInput
          title={translate(I18N_KEYS.SECURITY_CODE_DESCRIPTION)}
          securityToken={emailToken}
          maxLength={SECURITY_TOKEN_MAX_LENGTH}
          onTokenInputChange={onTokenInputChange}
          errorMessage={
            error
              ? translate(
                  I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR
                )
              : undefined
          }
        />
        <Button
          type="submit"
          id="extng-submit-email-token-button"
          data-testid="login-button"
          isLoading={isLoading}
          disabled={emailToken.length < EMAIL_TOKEN_MINIMAL_LENGTH}
          size="large"
          fullsize
          sx={{ marginTop: "16px" }}
        >
          {translate(I18N_KEYS.LOG_IN)}
        </Button>
      </form>

      <div>
        <Paragraph>{translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}</Paragraph>
        <div>
          <LinkButton
            onClick={() => {
              handleTokenResent();
            }}
          >
            {translate(I18N_KEYS.RESEND_TOKEN)}
          </LinkButton>

          {showConfirmTokenResent ? (
            <div
              sx={{ display: "flex" }}
              style={{
                margin: "24px 0",
              }}
            >
              <Animation
                height={18.5}
                width={18.5}
                animationParams={{
                  renderer: "svg",
                  animationData: successLottie,
                  loop: false,
                  autoplay: true,
                }}
              />
              <Paragraph
                color="ds.text.positive.quiet"
                sx={{ marginLeft: "8px" }}
              >
                {translate(I18N_KEYS.TOKEN_RESENT_CONFIRMATION)}
              </Paragraph>
            </div>
          ) : null}
        </div>

        {isDashlaneAuthenticatorAvailable ? (
          <div sx={{ marginTop: "16px" }}>
            <Paragraph>{translate(I18N_KEYS.CANT_ACCESS_EMAIL)}</Paragraph>
            <LinkButton
              onClick={() => {
                handleSwicthToDashlaneAuthenticator();
              }}
            >
              {translate(I18N_KEYS.USE_DASHLANE_AUTHENTICATOR_APP)}
            </LinkButton>
          </div>
        ) : null}
      </div>
    </WebappLoginLayout>
  );
};
