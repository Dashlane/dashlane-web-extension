import React, { useState } from "react";
import { useFormik } from "formik";
import { device } from "@dashlane/browser-utils";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { Button, Flex } from "@dashlane/design-system";
import {
  FlowStep,
  UserResendTokenEvent,
  UserUseAccountRecoveryKeyEvent,
} from "@dashlane/hermes";
import { Result } from "@dashlane/framework-types";
import { Link, Paragraph } from "@dashlane/ui-components";
import {
  CONFIRM_TOKEN_RESENT_RESET_TIMEOUT,
  SECURITY_TOKEN_MAX_LENGTH,
} from "../../../../auth/login-panel/authentication-flow/constants";
import { SecurityCodeInput } from "../../../../auth/login-panel/authentication-flow/components";
import successLottie from "../../../../libs/assets/lottie-success.json";
import Animation from "../../../../libs/dashlane-style/animation";
import { logEvent } from "../../../../libs/logs/logEvent";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { redirect } from "../../../../libs/router";
import { LOGIN_URL_SEGMENT } from "../../../../app/routes/constants";
const I18N_KEYS = {
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
  VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON:
    "login_verify_your_identity_step_button",
  VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON: "_common_action_cancel",
};
const I18N_ERROR_KEYS = {
  TOKEN_NOT_VALID:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_invalid_security_code",
  TOKEN_EXPIRED:
    "webapp_login_form_password_fieldset_security_code_error_token_expired",
  TOKEN_TOO_MANY_ATTEMPTS:
    "webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts",
  TOKEN_ACCOUNT_LOCKED:
    "webapp_login_form_password_fieldset_security_code_error_token_account_locked",
  UNKNOWN_ERROR:
    "webapp_login_form_password_fieldset_security_code_error_unkown",
  NETWORK_ERROR: "webapp_login_form_password_fieldset_network_error_offline",
};
interface Props
  extends Pick<
    IdentityVerificationFlowContracts.IdentityVerificationFlowEmailTokenView,
    "error" | "isLoading" | "isDashlaneAuthenticatorAvailable"
  > {
  resendEmailToken: () => Promise<Result<undefined>>;
  switchToDashlaneAuthenticator: () => Promise<Result<undefined>>;
  submitEmailToken: (params: {
    emailToken: string;
    deviceName: string;
  }) => Promise<Result<undefined>>;
  cancelAccountRecoveryKey: () => Promise<Result<undefined>>;
  clearInputError: () => void;
}
export const AccountEmailToken = ({
  error,
  isLoading,
  isDashlaneAuthenticatorAvailable,
  resendEmailToken,
  switchToDashlaneAuthenticator,
  submitEmailToken,
  cancelAccountRecoveryKey,
  clearInputError,
}: Props) => {
  const { translate } = useTranslate();
  const EMAIL_TOKEN_MINIMAL_LENGTH = 6;
  const [showConfirmTokenResent, setShowConfirmTokenResent] = useState(false);
  const paragraphStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    lineHeight: "20px",
  };
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
  const handleCancel = () => {
    void cancelAccountRecoveryKey();
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
    redirect(LOGIN_URL_SEGMENT);
  };
  return (
    <form onSubmit={handleSubmit}>
      <SecurityCodeInput
        title={translate(I18N_KEYS.SECURITY_CODE_DESCRIPTION)}
        securityToken={emailToken}
        maxLength={SECURITY_TOKEN_MAX_LENGTH}
        onTokenInputChange={onTokenInputChange}
        errorMessage={
          error
            ? translate(I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR)
            : undefined
        }
      />
      <Flex sx={{ margin: "24px 0px 16px" }}>
        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{
            ...paragraphStyle,
            marginRight: "4px",
          }}
        >
          {translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}
        </Paragraph>
        <Link
          onClick={handleTokenResent}
          color="ds.text.brand.quiet"
          sx={{ marginRight: "4px" }}
        >
          {translate(I18N_KEYS.RESEND_TOKEN)}
        </Link>
      </Flex>

      {showConfirmTokenResent ? (
        <Flex
          style={{
            marginTop: "24px",
            marginBottom: "24px",
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
          <Paragraph color="ds.text.positive.quiet" sx={{ marginLeft: "4px" }}>
            {translate(I18N_KEYS.TOKEN_RESENT_CONFIRMATION)}
          </Paragraph>
        </Flex>
      ) : null}
      {isDashlaneAuthenticatorAvailable ? (
        <Flex>
          <Paragraph
            color="ds.text.neutral.quiet"
            sx={{
              ...paragraphStyle,
              marginRight: "4px",
            }}
          >
            {translate(I18N_KEYS.CANT_ACCESS_EMAIL)}
          </Paragraph>
          <Link
            onClick={handleSwicthToDashlaneAuthenticator}
            color="ds.text.brand.quiet"
          >
            {translate(I18N_KEYS.USE_DASHLANE_AUTHENTICATOR_APP)}
          </Link>
        </Flex>
      ) : null}

      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: "42px",
        }}
      >
        <Button
          id="cancel-button"
          data-testid="cancel-button"
          mood="neutral"
          intensity="quiet"
          sx={{ marginRight: "16px" }}
          onClick={handleCancel}
        >
          {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON)}
        </Button>
        <Button
          type="submit"
          id="extng-submit-email-token-button"
          data-testid="login-button"
          isLoading={isLoading}
          disabled={emailToken.length < EMAIL_TOKEN_MINIMAL_LENGTH}
          onClick={() => handleSubmit()}
        >
          {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON)}
        </Button>
      </div>
    </form>
  );
};
