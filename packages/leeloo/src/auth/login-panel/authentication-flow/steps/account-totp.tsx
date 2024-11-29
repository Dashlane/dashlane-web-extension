import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { AuthenticationCode } from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  Button,
  Infobox,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { HELPCENTER_CANNOT_LOGIN_SECURITY_CODE_URL } from "../../../../app/routes/constants";
import {
  EmailHeader,
  Header,
  SecurityCodeInput,
  WebappLoginLayout,
} from "../components";
import { SECURITY_TOKEN_MAX_LENGTH } from "../constants";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  NavLink,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
const I18N_KEYS = {
  HEADING: "webapp_login_form_heading_log_in",
  LOG_IN: "webapp_auth_panel_login",
  SECURITY_CODE_DESCRIPTION:
    "webapp_login_form_password_fieldset_security_code_otp_description",
  SECURITY_CODE_LOST_PHONE: "webapp_two_factor_authentication_lost_your_phone",
  SECURITY_CODE_LOST_PHONE_LINK: "webapp_two_factor_authentication_reset_2fa",
  SECURITY_CODE_BACKUP_CODE_ACCESS:
    "webapp_two_factor_authentication_cant_access_your_app",
  SECURITY_CODE_BACKUP_CODE_LINK:
    "webapp_two_factor_authentication_use_backup_code",
  SYNC_DEVICES_INFOBOX:
    "webapp_two_factor_authentication_sync_devices_time_infobox_markup",
};
const I18N_ERROR_KEYS = {
  EMPTY_OTP:
    "webapp_login_form_password_fieldset_security_code_error_empty_otp",
  OTP_NOT_VALID:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_invalid_security_code",
  OTP_ALREADY_USED:
    "webapp_login_form_password_fieldset_security_code_error_otp_already_used",
  OTP_TOO_MANY_ATTEMPTS:
    "webapp_login_form_password_fieldset_security_code_error_token_too_many_attempts",
  UNKNOWN_ERROR:
    "webapp_login_form_password_fieldset_security_code_error_unkown",
  NETWORK_ERROR: "webapp_login_form_password_fieldset_network_error_offline",
};
const OTP_MAX_LENGTH = 6;
const COMPLETE_OTP_EXP = RegExp(`^[0-9]{${OTP_MAX_LENGTH}}$`);
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpView,
    "step"
  > {
  submitTotp: (params: {
    twoFactorAuthenticationOtpValue: string;
  }) => Promise<Result<undefined>>;
  changeTwoFactorAuthenticationOtpType: (params: {
    twoFactorAuthenticationOtpType: AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpType;
  }) => Promise<Result<undefined>>;
  prefilledToken?: string;
  onClearPrefilledToken: () => void;
  clearInputError: () => void;
}
export const AccountTotp = ({
  loginEmail,
  error,
  isLoading,
  changeTwoFactorAuthenticationOtpType,
  clearInputError,
  submitTotp,
  prefilledToken,
  onClearPrefilledToken,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const [showSyncDevicesHelp, setShowSyncDevicesHelp] = useState(false);
  const prevErrorRef = useRef<string>();
  useEffect(() => {
    if (prefilledToken) {
      onClearPrefilledToken();
      submitTotp({ twoFactorAuthenticationOtpValue: prefilledToken });
    }
  }, [prefilledToken]);
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginTokenAuthenticator,
    });
  }, []);
  useEffect(() => {
    if (error) {
      setShowSyncDevicesHelp(
        prevErrorRef.current === error &&
          error === AuthenticationCode[AuthenticationCode.OTP_NOT_VALID]
      );
      prevErrorRef.current = error;
    }
  }, [error]);
  const {
    setFieldValue,
    handleSubmit,
    values: { twoFactorAuthenticationOtpValue },
  } = useFormik({
    initialValues: {
      twoFactorAuthenticationOtpValue: "",
    },
    onSubmit: ({ twoFactorAuthenticationOtpValue }) => {
      submitTotp({
        twoFactorAuthenticationOtpValue,
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
    void setFieldValue(
      "twoFactorAuthenticationOtpValue",
      formatAuthenticatorCode(value)
    );
    const isOTPInputComplete = COMPLETE_OTP_EXP.test(value);
    if (isOTPInputComplete) {
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
          securityToken={twoFactorAuthenticationOtpValue}
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
        {showSyncDevicesHelp ? (
          <Infobox
            sx={{ marginTop: "16px" }}
            title={translate.markup(
              I18N_KEYS.SYNC_DEVICES_INFOBOX,
              {
                supportArticleLink: HELPCENTER_CANNOT_LOGIN_SECURITY_CODE_URL,
              },
              { linkTarget: "_blank" }
            )}
            mood="brand"
            size="small"
          />
        ) : null}
        <Button
          type="submit"
          data-testid="submitTotp"
          isLoading={isLoading}
          disabled={twoFactorAuthenticationOtpValue.length < OTP_MAX_LENGTH}
          size="large"
          fullsize
          sx={{ marginTop: "16px" }}
        >
          {translate(I18N_KEYS.LOG_IN)}
        </Button>
      </form>

      <div>
        <Paragraph>
          {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_ACCESS)}
        </Paragraph>
        <LinkButton
          onClick={() =>
            changeTwoFactorAuthenticationOtpType({
              twoFactorAuthenticationOtpType: "backupCode",
            })
          }
        >
          {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LINK)}
        </LinkButton>
        <Paragraph
          sx={{
            marginTop: "16px",
          }}
        >
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE)}
        </Paragraph>
        <LinkButton
          as={NavLink}
          to={routes.recover2faCodes(loginEmail)}
          isExternal
        >
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
        </LinkButton>
      </div>
    </WebappLoginLayout>
  );
};
