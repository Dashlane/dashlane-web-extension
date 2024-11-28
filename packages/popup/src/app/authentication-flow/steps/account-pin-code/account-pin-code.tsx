import { useFormik } from "formik";
import { Fragment, useEffect } from "react";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { Button, IndeterminateLoader, jsx } from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { EmailHeader } from "../../components";
import { Header } from "../../components/header";
import { PopupLoginLayout } from "../../components/popup-login-layout";
import { FORM_SX_STYLES, PIN_CODE_LENGTH } from "../../constants";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsMPlessUser } from "../../../../libs/api";
import { MaxAttemptsReachedPasswordlessComponent } from "./max-attempts-reached-passwordless";
import { MaxAttemptsReachedMasterPasswordComponent } from "./max-attempts-reached-mp";
import { usePinCodeStatusForUser } from "../../hooks/use-pin-code-status-for-user";
import { PincodeInput } from "../../components/pin-code-input";
export const I18N_KEYS = {
  ENTER_YOUR_PIN_HEADING: "login/heading_unlock_pin",
  USE_MP_INSTEAD_BUTTON: "login/form_pin_use_mp",
  USE_ANOTHER_DEVICE_INSTEAD: "login/form_pin_login_with_another_device",
};
export const I18N_ERROR_KEYS = {
  WRONG_PIN: "login/form_pin_wrong_pin",
  UNKNOWN_ERROR: "login/security_code_error_unkown",
} as const;
interface Props
  extends Omit<
    AuthenticationFlowContracts.AuthenticationFlowPinCodeView,
    "step"
  > {
  clearInputError: () => void;
  switchToMasterPassword: () => Promise<Result<undefined>>;
  switchToDeviceToDeviceAuthentication: () => Promise<Result<undefined>>;
  submitPinCode: (params: { pinCode: string }) => Promise<Result<undefined>>;
}
interface FormValues {
  pinCode: string;
}
export const AccountPinCode = ({
  loginEmail,
  error,
  switchToMasterPassword,
  switchToDeviceToDeviceAuthentication,
  submitPinCode,
  clearInputError,
  isLoading,
}: Props) => {
  const { translate } = useTranslate();
  const { isMPLessUser } = useIsMPlessUser();
  const pinCodeStatus = usePinCodeStatusForUser(loginEmail);
  const { isPinCodeEnabled } = pinCodeStatus;
  const translatedError =
    isPinCodeEnabled && error === "wrong_pin_code"
      ? translate(I18N_ERROR_KEYS.WRONG_PIN, {
          count: pinCodeStatus.attemptsLeft,
        })
      : error
      ? translate(I18N_ERROR_KEYS.UNKNOWN_ERROR)
      : undefined;
  const {
    handleSubmit,
    values: { pinCode },
    setFieldValue,
  } = useFormik({
    initialValues: {
      pinCode: "",
    },
    onSubmit: async ({ pinCode }: FormValues) => {
      await submitPinCode({ pinCode });
    },
  });
  useEffect(() => {
    if (error) {
      void setFieldValue("pinCode", "");
    }
  }, [error, setFieldValue]);
  const handlePinCodeChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const {
      target: { value },
    } = e;
    const formatedPinCode = value.replace(/\D/g, "");
    clearInputError();
    void setFieldValue("pinCode", formatedPinCode);
    if (value.length === PIN_CODE_LENGTH) {
      handleSubmit();
    }
  };
  return (
    <>
      <EmailHeader
        loginEmail={loginEmail}
        showAccountsActionsDropdown
        showLogoutDropdown={false}
      />
      <form sx={FORM_SX_STYLES} onSubmit={handleSubmit} noValidate>
        {!isPinCodeEnabled ? (
          !isMPLessUser ? (
            <MaxAttemptsReachedMasterPasswordComponent
              switchToMasterPassword={switchToMasterPassword}
            />
          ) : (
            <MaxAttemptsReachedPasswordlessComponent
              switchToDeviceToDeviceAuthentication={
                switchToDeviceToDeviceAuthentication
              }
            />
          )
        ) : (
          <>
            <PopupLoginLayout>
              <Header text={translate(I18N_KEYS.ENTER_YOUR_PIN_HEADING)} />

              <div
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexGrow: "1",
                  alignItems: "center",
                }}
              >
                <div>
                  <PincodeInput
                    pincode={pinCode}
                    pinLength={PIN_CODE_LENGTH}
                    onPincodeInputChange={handlePinCodeChange}
                    displayMismatchError={error}
                    mismatchErrorMessage={translatedError}
                  />
                </div>
                {isLoading ? (
                  <IndeterminateLoader mood="brand" size={40} />
                ) : null}
              </div>
            </PopupLoginLayout>
            {!isMPLessUser ? (
              <Button
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  void switchToMasterPassword();
                }}
                mood="neutral"
                intensity="quiet"
                fullsize
                size="large"
              >
                {translate(I18N_KEYS.USE_MP_INSTEAD_BUTTON)}
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  void switchToDeviceToDeviceAuthentication();
                }}
                mood="neutral"
                intensity="quiet"
                fullsize
                size="large"
              >
                {translate(I18N_KEYS.USE_ANOTHER_DEVICE_INSTEAD)}
              </Button>
            )}
          </>
        )}
      </form>
    </>
  );
};
