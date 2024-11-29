import * as React from "react";
import { Lee } from "../../../lee";
import { Flex } from "@dashlane/design-system";
import {
  Button,
  colors,
  Heading,
  Link,
  LoadingIcon,
  Paragraph,
  TokenInput,
} from "@dashlane/ui-components";
import { EmailTokenResult } from "@dashlane/communication";
import { useUserLogin } from "./useGetUserLogin";
import { LogOutContainer } from "../../../log-out-container/log-out-container";
import successLottie from "../../../libs/assets/lottie-success.json";
import failureLottie from "../../../libs/assets/lottie-failure.json";
import { carbonConnector } from "../../../libs/carbon/connector";
import Animation from "../../../libs/dashlane-style/animation";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useHistory } from "../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../libs/router/RouterGlobalSettingsProvider";
import { logResendTokenEvent } from "./logs";
import styles from "./verify-account-panel.css";
const I18N_KEYS = {
  VERIFY_ACCOUNT_TITLE: "webapp_account_recovery_verify_account_title",
  SECURITY_CODE_DESCRIPTION:
    "webapp_account_recovery_security_code_description",
  SECURITY_CODE_OTP_DESCRIPTION:
    "webapp_login_form_password_fieldset_security_code_otp_description",
  VERIFY_LABEL: "webapp_account_recovery_verify_button",
  RESEND_TOKEN: "webapp_login_form_password_fieldset_resend_token",
  TOKEN_RESENT_CONFIRMATION:
    "webapp_login_form_password_fieldset_security_code_resent",
  TOKEN_RESENT_FAILURE: "_common_generic_error",
  SECURITY_CODE_RESENT:
    "webapp_login_form_password_fieldset_security_code_resent",
  DIDNT_RECEIVE_CODE:
    "webapp_dashlane_authenticator_authentication_didnt_receive_code",
  BACK_TO_LOGIN_LABEL: "webapp_account_recovery_back_to_login",
};
const I18N_ERROR_KEYS = {
  REGISTER_DEVICE_FAILED:
    "webapp_login_form_password_fieldset_security_code_error_token_not_valid",
};
export interface Props {
  dispatchGlobal: Lee["dispatchGlobal"];
  setShowGenericRecoveryError: (arg: boolean) => void;
}
enum ErrorTypes {
  CODE_ERROR = "code_error",
}
const otpTypes = ["email_token", "totp", "u2f"];
export const VerifyAccountPanel = ({
  dispatchGlobal,
  setShowGenericRecoveryError,
}: Props) => {
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const login = useUserLogin();
  const [token, setToken] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] =
    React.useState(true);
  const [tokenResentResult, setTokenResentResult] = React.useState<
    EmailTokenResult | undefined
  >();
  const [otpType, setOtpType] = React.useState("");
  const [tokenVericationError, setTokenVerificationError] =
    React.useState<ErrorTypes.CODE_ERROR | null>(null);
  const tokenResentTimeout = React.useRef<NodeJS.Timeout>();
  const CONFIRM_TOKEN_RESENT_RESET_TIMEOUT = 2000;
  const MAX_LENGTH_TOKEN = 6;
  const sendToken = () => {
    return carbonConnector.requestEmailToken();
  };
  const setOtp = React.useCallback(async () => {
    if (login !== "") {
      const response = await carbonConnector.startAccountRecovery({
        login,
      });
      if (!response.success) {
        setOtpType("");
        return;
      }
      const verificationType = response.verification[0]?.type;
      if (otpTypes.includes(verificationType)) {
        setOtpType(verificationType);
      } else {
        setOtpType("");
      }
    }
  }, [login]);
  React.useEffect(() => {
    sendToken();
    setOtp();
    return () => {
      clearTimeout(tokenResentTimeout.current);
    };
  }, [setOtp]);
  const onCodeChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const filteredValue = evt.target.value.replace(/\D/g, "");
    if (filteredValue.length === MAX_LENGTH_TOKEN) {
      setIsSubmitButtonDisabled(false);
    } else {
      setIsSubmitButtonDisabled(true);
    }
    if (token !== filteredValue) {
      setToken(filteredValue);
      setTokenVerificationError(null);
    }
  };
  const onResendCode = async () => {
    try {
      logResendTokenEvent();
      setToken("");
      setIsSubmitButtonDisabled(true);
      setTokenVerificationError(null);
      const result = await sendToken();
      setTokenResentResult(result);
    } catch (error) {
      setTokenResentResult({ success: false, error });
    }
    tokenResentTimeout.current = setTimeout(() => {
      setTokenResentResult(undefined);
    }, CONFIRM_TOKEN_RESENT_RESET_TIMEOUT);
  };
  const verifyCode = async (
    event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>
  ) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const deviceRegistered = await carbonConnector.registerDeviceForRecovery({
        login,
        token,
      });
      setIsLoading(false);
      if (!deviceRegistered.success) {
        setTokenVerificationError(ErrorTypes.CODE_ERROR);
        return;
      }
      history.push(routes.userCreateMasterPassword);
    } catch (err) {
      setShowGenericRecoveryError(true);
    }
  };
  const isLoadingOrDisabled = () => {
    return isSubmitButtonDisabled || isLoading;
  };
  const showResendCode = otpType === "" || otpType === otpTypes[0];
  const getOtpText = () => {
    let otpText = null;
    if (showResendCode) {
      otpText = translate(I18N_KEYS.SECURITY_CODE_DESCRIPTION);
    } else {
      otpText = translate(I18N_KEYS.SECURITY_CODE_OTP_DESCRIPTION);
    }
    return otpText;
  };
  return (
    <div className={styles.verifyAccountPanelContainer}>
      <div className={styles.content}>
        <LogOutContainer dispatchGlobal={dispatchGlobal} />
        <Flex className={styles.inner}>
          <Heading size="medium" className={styles.heading}>
            {translate(I18N_KEYS.VERIFY_ACCOUNT_TITLE)}
          </Heading>
          <Paragraph size="medium" color={colors.grey00}>
            {getOtpText()}
          </Paragraph>
          <Paragraph
            className={styles.setEmail}
            bold
            size="medium"
            color={colors.midGreen00}
          >
            {login}
          </Paragraph>
          <form className={styles.form} onSubmit={verifyCode}>
            <TokenInput
              autoFocus
              value={token}
              maxLength={MAX_LENGTH_TOKEN}
              inputMode="numeric"
              feedbackType={tokenVericationError ? "error" : undefined}
              feedbackText={
                tokenVericationError === ErrorTypes.CODE_ERROR
                  ? translate(I18N_ERROR_KEYS.REGISTER_DEVICE_FAILED)
                  : ""
              }
              onChange={onCodeChange}
            />
            <Button
              type="submit"
              size="large"
              onClick={verifyCode}
              className={styles.verifyButton}
              disabled={isLoadingOrDisabled()}
            >
              {isLoading ? <LoadingIcon /> : translate(I18N_KEYS.VERIFY_LABEL)}
            </Button>
          </form>

          {showResendCode ? (
            <div>
              <Paragraph>{translate(I18N_KEYS.DIDNT_RECEIVE_CODE)}</Paragraph>
              <Flex>
                <Link
                  onClick={onResendCode}
                  color="ds.text.brand.quiet"
                  sx={{ marginRight: "4px" }}
                >
                  {translate(I18N_KEYS.RESEND_TOKEN)}
                </Link>
                {tokenResentResult ? (
                  <Flex
                    style={{
                      marginTop: "24px",
                      marginBottom: "24px",
                      flexWrap: "nowrap",
                    }}
                  >
                    <Animation
                      height={18.5}
                      width={18.5}
                      animationParams={{
                        renderer: "svg",
                        animationData: tokenResentResult.success
                          ? successLottie
                          : failureLottie,
                        loop: false,
                        autoplay: true,
                      }}
                    />
                    <Paragraph
                      color={
                        tokenResentResult.success
                          ? "ds.text.positive.quiet"
                          : "ds.text.danger.quiet"
                      }
                      sx={{ marginLeft: "4px" }}
                    >
                      {translate(
                        tokenResentResult.success
                          ? I18N_KEYS.TOKEN_RESENT_CONFIRMATION
                          : I18N_KEYS.TOKEN_RESENT_FAILURE
                      )}
                    </Paragraph>
                  </Flex>
                ) : null}
              </Flex>
            </div>
          ) : null}
        </Flex>
      </div>
    </div>
  );
};
