import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationCode } from "@dashlane/communication";
import { Button, Flex, Infobox } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { FlowStep, UserUseAccountRecoveryKeyEvent } from "@dashlane/hermes";
import { Link, Paragraph } from "@dashlane/ui-components";
import {
  HELPCENTER_CANNOT_LOGIN_SECURITY_CODE_URL,
  LOGIN_URL_SEGMENT,
} from "../../../../app/routes/constants";
import { SecurityCodeInput } from "../../../../auth/login-panel/authentication-flow/components";
import { SECURITY_TOKEN_MAX_LENGTH } from "../../../../auth/login-panel/authentication-flow/constants";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  NavLink,
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { logEvent } from "../../../../libs/logs/logEvent";
const I18N_KEYS = {
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
  VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON:
    "login_verify_your_identity_step_button",
  VERIFY_YOUR_IDENTITY_STEP_CANCEL_BUTTON: "_common_action_cancel",
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
  extends Pick<
    IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpView,
    "error" | "isLoading"
  > {
  submitTotp: (params: {
    twoFactorAuthenticationOtpValue: string;
  }) => Promise<Result<undefined>>;
  changeTwoFactorAuthenticationOtpType: (params: {
    twoFactorAuthenticationOtpType: IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpType;
  }) => Promise<Result<undefined>>;
  cancelAccountRecoveryKey: () => Promise<Result<undefined>>;
  clearInputError: () => void;
  login: string;
}
const paragraphStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  lineHeight: "20px",
};
export const AccountTotp = ({
  error,
  isLoading,
  submitTotp,
  changeTwoFactorAuthenticationOtpType,
  cancelAccountRecoveryKey,
  clearInputError,
  login,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const [showSyncDevicesHelp, setShowSyncDevicesHelp] = useState(false);
  const prevErrorRef = useRef<string>();
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
  const handleCancel = () => {
    void cancelAccountRecoveryKey();
    logEvent(new UserUseAccountRecoveryKeyEvent({ flowStep: FlowStep.Cancel }));
    redirect(LOGIN_URL_SEGMENT);
  };
  return (
    <form onSubmit={handleSubmit}>
      <SecurityCodeInput
        title={translate(I18N_KEYS.SECURITY_CODE_DESCRIPTION)}
        securityToken={twoFactorAuthenticationOtpValue}
        maxLength={SECURITY_TOKEN_MAX_LENGTH}
        onTokenInputChange={onTokenInputChange}
        errorMessage={
          error
            ? translate(I18N_ERROR_KEYS[error] ?? I18N_ERROR_KEYS.UNKNOWN_ERROR)
            : undefined
        }
      />
      {showSyncDevicesHelp ? (
        <Infobox
          sx={{ marginTop: "24px" }}
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

      <Flex sx={{ margin: "24px 0px 16px" }}>
        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{
            ...paragraphStyle,
            marginRight: "4px",
          }}
        >
          {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_ACCESS)}
        </Paragraph>
        <Link
          onClick={() =>
            changeTwoFactorAuthenticationOtpType({
              twoFactorAuthenticationOtpType: "backupCode",
            })
          }
          color="ds.text.brand.quiet"
          target="_self"
        >
          {translate(I18N_KEYS.SECURITY_CODE_BACKUP_CODE_LINK)}
        </Link>
      </Flex>

      <Flex>
        <Paragraph
          color="ds.text.neutral.quiet"
          sx={{
            ...paragraphStyle,
            marginRight: "4px",
          }}
        >
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE)}
        </Paragraph>
        <NavLink
          color="ds.text.brand.standard"
          to={`/${routes.recover2faCodes(login)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {translate(I18N_KEYS.SECURITY_CODE_LOST_PHONE_LINK)}
        </NavLink>
      </Flex>

      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: "40px",
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
          data-testid="submitTotp"
          isLoading={isLoading}
          disabled={twoFactorAuthenticationOtpValue.length < OTP_MAX_LENGTH}
        >
          {translate(I18N_KEYS.VERIFY_YOUR_IDENTITY_STEP_VERIFY_BUTTON)}
        </Button>
      </div>
    </form>
  );
};
