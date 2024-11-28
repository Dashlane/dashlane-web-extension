import { useFormik } from "formik";
import { Fragment, FunctionComponent, useEffect, useState } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { device } from "@dashlane/browser-utils";
import {
  Button,
  Icon,
  jsx,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { PageView, UserResendTokenEvent } from "@dashlane/hermes";
import { EmailHeader, SecurityCodeInput } from "../components";
import { Header } from "../components/header";
import { PopupLoginLayout } from "../components/popup-login-layout";
import {
  CONFIRM_TOKEN_RESENT_RESET_TIMEOUT,
  FORM_SX_STYLES,
  SECURITY_TOKEN_MAX_LENGTH,
} from "../constants";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
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
const EMAIL_TOKEN_MINIMAL_LENGTH = 6;
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowEmailTokenView,
    "step"
  > {
  submitEmailToken: (params: {
    emailToken: string;
    deviceName: string;
  }) => Promise<Result<undefined>>;
  switchToDashlaneAuthenticator: () => Promise<Result<undefined>>;
  resendEmailToken: () => Promise<Result<undefined>>;
  clearInputError: () => void;
}
export const AccountEmailToken: FunctionComponent<Props> = ({
  loginEmail,
  isLoading,
  error,
  isDashlaneAuthenticatorAvailable,
  submitEmailToken,
  resendEmailToken,
  switchToDashlaneAuthenticator,
  clearInputError,
  localAccounts,
}: Props) => {
  const { translate } = useTranslate();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginTokenEmail,
    });
  }, []);
  const logUserResendTokenEvent = () => {
    void logEvent(new UserResendTokenEvent({}));
  };
  const handleResendEmailToken = () => {
    logUserResendTokenEvent();
    void resendEmailToken();
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, CONFIRM_TOKEN_RESENT_RESET_TIMEOUT);
  };
  const handleSwitchToDashlaneAuthenticator = () => {
    void switchToDashlaneAuthenticator();
  };
  const {
    setFieldValue,
    handleSubmit,
    values: { emailToken },
  } = useFormik({
    initialValues: {
      emailToken: "",
    },
    onSubmit: () => {
      void submitEmailToken({
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
  const secondaryButtonContent = isDashlaneAuthenticatorAvailable
    ? translate(I18N_KEYS.USE_DASHLANE_AUTHENTICATOR_APP)
    : showSuccessMessage
    ? translate(I18N_KEYS.RESEND_CODE_SUCCESS)
    : translate(I18N_KEYS.RESEND_CODE);
  return (
    <>
      <EmailHeader
        loginEmail={loginEmail ?? ""}
        showAccountsActionsDropdown
        showLogoutDropdown={false}
        localAccounts={localAccounts}
      />

      <form sx={FORM_SX_STYLES} onSubmit={handleSubmit} noValidate>
        <PopupLoginLayout>
          <Header text={translate(I18N_KEYS.TITLE)} />
          <SecurityCodeInput
            securityToken={emailToken}
            maxLength={SECURITY_TOKEN_MAX_LENGTH}
            onTokenInputChange={onTokenInputChange}
            title={translate(I18N_KEYS.DESCRIPTION)}
            errorMessage={
              error &&
              translate(
                error in ERROR_I18N_KEYS
                  ? ERROR_I18N_KEYS[error as keyof typeof ERROR_I18N_KEYS]
                  : ERROR_I18N_KEYS.UNKNOWN_ERROR
              )
            }
          />

          {isDashlaneAuthenticatorAvailable ? (
            <div sx={{ marginTop: "24px" }}>
              <Paragraph color="ds.text.neutral.quiet">
                {translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}
              </Paragraph>
              <div
                sx={{ display: "flex", alignItems: "center", height: "24px" }}
              >
                <LinkButton
                  as="button"
                  onClick={() => handleResendEmailToken()}
                >
                  {translate(I18N_KEYS.RESEND_CODE)}
                </LinkButton>
                {showSuccessMessage ? (
                  <Icon
                    name="FeedbackSuccessOutlined"
                    size="large"
                    color="ds.text.positive.quiet"
                    sx={{ marginLeft: "12px" }}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </PopupLoginLayout>

        <Button
          type="submit"
          id="extng-submit-email-token-button"
          aria-label={translate(I18N_KEYS.CONTINUE)}
          isLoading={isLoading}
          disabled={emailToken.length < EMAIL_TOKEN_MINIMAL_LENGTH}
          fullsize
          size="large"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.CONTINUE)}
        </Button>
        <Button
          onClick={
            isDashlaneAuthenticatorAvailable
              ? handleSwitchToDashlaneAuthenticator
              : handleResendEmailToken
          }
          mood="neutral"
          intensity="quiet"
          fullsize
          size="large"
        >
          {secondaryButtonContent}
        </Button>
      </form>
    </>
  );
};
