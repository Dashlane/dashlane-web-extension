import { useFormik } from "formik";
import {
  Fragment,
  FunctionComponent,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationCode } from "@dashlane/communication";
import { Button, Infobox, jsx } from "@dashlane/design-system";
import { useAnalyticsCommands } from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import { PageView } from "@dashlane/hermes";
import { EmailHeader, SecurityCodeInput } from "../components";
import { Header } from "../components/header";
import { PopupLoginLayout } from "../components/popup-login-layout";
import { FORM_SX_STYLES, SECURITY_TOKEN_MAX_LENGTH } from "../constants";
import useTranslate from "../../../libs/i18n/useTranslate";
const ERROR_I18N_KEYS = {
  OTP_NOT_VALID: "login/security_code_error_otp_not_valid",
  OTP_TOO_MANY_ATTEMPTS: "login/security_code_error_token_too_many_attempts",
  OTP_ALREADY_USED: "login/security_code_error_token_expired",
  UNKNOWN_ERROR: "login/security_code_error_otp_not_valid",
  NETWORK_ERROR: "login/security_code_error_network_error",
};
const I18N_KEYS = {
  TITLE: "login/otp2_label",
  CONTINUE: "login/otp2_confirm_button",
  DESCRIPTION: "login/otp_description",
  USE_BACKUP_CODE: "login/otp2_send_backup_code_button",
  SYNC_DEVICES_TIME_INFOBOX: "login/otp_sync_devices_time_infobox",
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
  clearInputError: () => void;
}
export const AccountTotp: FunctionComponent<Props> = ({
  loginEmail,
  isLoading,
  error,
  changeTwoFactorAuthenticationOtpType,
  clearInputError,
  submitTotp,
  localAccounts,
}: Props) => {
  const { translate } = useTranslate();
  const [showSyncDevicesHelp, setShowSyncDevicesHelp] = useState(false);
  const prevErrorRef = useRef<string>();
  const { trackPageView } = useAnalyticsCommands();
  useEffect(() => {
    void trackPageView({
      pageView: PageView.LoginTokenAuthenticator,
    });
  }, []);
  useEffect(() => {
    setShowSyncDevicesHelp(false);
    prevErrorRef.current = "";
  }, [loginEmail]);
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
      void submitTotp({
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
            title={translate(I18N_KEYS.DESCRIPTION)}
            securityToken={twoFactorAuthenticationOtpValue}
            maxLength={SECURITY_TOKEN_MAX_LENGTH}
            onTokenInputChange={onTokenInputChange}
            errorMessage={
              error &&
              translate(
                error in ERROR_I18N_KEYS
                  ? ERROR_I18N_KEYS[error as keyof typeof ERROR_I18N_KEYS]
                  : ERROR_I18N_KEYS.UNKNOWN_ERROR
              )
            }
          />

          {showSyncDevicesHelp ? (
            <Infobox
              sx={{ marginBottom: "16px" }}
              title={translate(I18N_KEYS.SYNC_DEVICES_TIME_INFOBOX)}
              size="small"
              mood="brand"
            />
          ) : null}
        </PopupLoginLayout>

        <Button
          type="submit"
          aria-label={translate(I18N_KEYS.CONTINUE)}
          isLoading={isLoading}
          disabled={twoFactorAuthenticationOtpValue.length < OTP_MAX_LENGTH}
          fullsize
          size="large"
          sx={{ marginBottom: "8px" }}
        >
          {translate(I18N_KEYS.CONTINUE)}
        </Button>
        <Button
          onClick={() => {
            void changeTwoFactorAuthenticationOtpType({
              twoFactorAuthenticationOtpType: "backupCode",
            });
          }}
          mood="neutral"
          intensity="quiet"
          fullsize
          size="large"
        >
          {translate(I18N_KEYS.USE_BACKUP_CODE)}
        </Button>
      </form>
    </>
  );
};
