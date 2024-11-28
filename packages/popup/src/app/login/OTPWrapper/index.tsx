import React, { useEffect, useRef, useState } from "react";
import OTPStep, { OTPStepProps } from "../AuthorizationStep/otp";
import useTranslate from "../../../libs/i18n/useTranslate";
import { AuthenticationCode } from "@dashlane/communication";
const ERROR_I18N_KEYS = {
  EMPTY_OTP: "login/security_code_error_empty_otp",
  OTP_NOT_VALID: "login/security_code_error_otp_not_valid",
  OTP_ALREADY_USED: "login/otp_backup_code_error_already_used",
  OTP_TOO_MANY_ATTEMPTS: "login/security_code_error_token_too_many_attempts",
  NETWORK_ERROR: "login/security_code_error_network_error",
  UNKNOWN_ERROR: "popup_common_generic_error",
};
const I18N_KEYS = {
  CONFIRM: "login/otp2_confirm_button",
  DESCRIPTION: "login/otp_description",
  TITLE: "login/otp2_label",
  USE_BACKUP_CODE: "login/otp2_send_backup_code_button",
};
interface Props {
  login: string;
  isLoading: boolean;
  setWaitingForResponseState: () => void;
  handleSubmit: (params: { login: string; otp: string }) => void;
  onSwitchAuthMethodClick: () => void;
  resetErrorState: () => void;
  error?: string;
}
const OTPWrapper: React.FunctionComponent<Props> = (props: Props) => {
  const { error, login } = props;
  const { translate } = useTranslate();
  const [codeValue, setCodeValue] = React.useState("");
  const [showSyncDevicesHelp, setShowSyncDevicesHelp] = useState(false);
  const prevErrorRef = useRef<string>();
  useEffect(() => {
    setCodeValue("");
    setShowSyncDevicesHelp(false);
    prevErrorRef.current = "";
  }, [login]);
  useEffect(() => {
    if (error) {
      setShowSyncDevicesHelp(
        prevErrorRef.current === error &&
          error === AuthenticationCode[AuthenticationCode.OTP_NOT_VALID]
      );
      prevErrorRef.current = error;
    }
  }, [error]);
  const handleOTPSubmit = (otp: string) => {
    props.handleSubmit({ login: props.login, otp });
    props.setWaitingForResponseState();
  };
  const otpStepProps: OTPStepProps = {
    error:
      error &&
      translate(
        error in ERROR_I18N_KEYS
          ? ERROR_I18N_KEYS[error as keyof typeof ERROR_I18N_KEYS]
          : ERROR_I18N_KEYS.UNKNOWN_ERROR
      ),
    titleCopy: translate(I18N_KEYS.TITLE),
    descriptionCopy: translate(I18N_KEYS.DESCRIPTION),
    handleCodeSubmit: handleOTPSubmit,
    resetErrorState: props.resetErrorState,
    formActionsProps: {
      isLoading: props.isLoading,
      primaryButtonText: translate(I18N_KEYS.CONFIRM),
      secondaryButtonText: translate(I18N_KEYS.USE_BACKUP_CODE),
      onSecondaryButtonClick: props.onSwitchAuthMethodClick,
    },
    codeValue,
    setCodeValue,
    showSyncDevicesHelp: showSyncDevicesHelp,
  };
  return <OTPStep {...otpStepProps} />;
};
export default OTPWrapper;
