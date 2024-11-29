import { useEffect } from "react";
import { useFormik } from "formik";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import {
  IndeterminateLoader,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import { Result } from "@dashlane/framework-types";
import { MaxAttemptsReachedMasterPasswordComponent } from "./max-attempts-reached-mp";
import { MaxAttemptsReachedPasswordlessComponent } from "./max-attempts-reached-passwordless";
import { EmailHeader, Header, WebappLoginLayout } from "../../components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useIsMPlessUser } from "../../../../../webapp/account/security-settings/hooks/use-is-mpless-user";
import { usePinCodeStatusForUser } from "../../../../hooks/use-pin-code-status-for-user";
import { PincodeInput } from "../../../../../pin-code/pin-code-input";
import { PIN_CODE_LENGTH } from "../../../../../pin-code/constants";
const I18N_KEYS = {
  HEADING: "webapp_login_form_heading_unlock_pin",
  USE_ANOTHER_ACCOUNT:
    "webapp_login_form_email_fieldset_select_option_other_account",
  FORGOT_YOUR_PIN: "webapp_login_form_pin_forgot",
  USE_MP_INSTEAD: "webapp_login_form_pin_use_mp",
  USE_D2D_INSTEAD: "webapp_login_form_pin_use_another_device_button",
  PIN_TITLE: "webapp_login_form_pin_title",
};
const I18N_ERROR_KEYS = {
  WRONG_PIN: "webapp_login_form_pin_wrong_pin",
  UNKNOWN_ERROR:
    "webapp_login_form_password_fieldset_security_code_error_unkown",
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
  isLoading,
  switchToMasterPassword,
  switchToDeviceToDeviceAuthentication,
  submitPinCode,
  clearInputError,
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
      setFieldValue("pinCode", "");
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
    setFieldValue("pinCode", formatedPinCode);
    if (value.length === PIN_CODE_LENGTH) {
      handleSubmit();
    }
  };
  return (
    <WebappLoginLayout>
      {!isPinCodeEnabled ? (
        !isMPLessUser ? (
          <MaxAttemptsReachedMasterPasswordComponent
            loginEmail={loginEmail}
            switchToMasterPassword={switchToMasterPassword}
          />
        ) : (
          <MaxAttemptsReachedPasswordlessComponent
            loginEmail={loginEmail}
            switchToDeviceToDeviceAuthentication={
              switchToDeviceToDeviceAuthentication
            }
          />
        )
      ) : (
        <>
          <Header text={translate(I18N_KEYS.HEADING)} />
          <EmailHeader selectedEmail={loginEmail} />
          <form onSubmit={handleSubmit}>
            <Paragraph
              color="ds.text.neutral.quiet"
              textStyle="ds.body.helper.regular"
            >
              {translate(I18N_KEYS.PIN_TITLE)}
            </Paragraph>

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
                  onPincodeInputChange={handlePinCodeChange}
                  displayMismatchError={error}
                  mismatchErrorMessage={translatedError}
                  disabled={isLoading}
                />
              </div>
              {isLoading ? (
                <IndeterminateLoader mood="brand" size={40} />
              ) : null}
            </div>
            {!isMPLessUser ? (
              <div sx={{ marginTop: "16px" }}>
                <Paragraph>{translate(I18N_KEYS.FORGOT_YOUR_PIN)}</Paragraph>
                <LinkButton
                  onClick={() => {
                    if (isLoading) {
                      return;
                    }
                    void switchToMasterPassword();
                  }}
                >
                  {translate(I18N_KEYS.USE_MP_INSTEAD)}
                </LinkButton>
              </div>
            ) : (
              <LinkButton
                sx={{ marginTop: "16px" }}
                as="button"
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  void switchToDeviceToDeviceAuthentication();
                }}
              >
                {translate(I18N_KEYS.USE_D2D_INSTEAD)}
              </LinkButton>
            )}
          </form>
        </>
      )}
    </WebappLoginLayout>
  );
};
