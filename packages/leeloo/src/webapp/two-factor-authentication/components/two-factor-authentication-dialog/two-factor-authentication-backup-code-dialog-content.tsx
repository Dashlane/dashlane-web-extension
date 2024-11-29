import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { DialogBody, DialogFooter } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logTwoFactorAuthenticationDisableBackupCodePageView } from "../../logs/disable-flow-logs";
import { TwoFactorAuthenticationErrorWithMessage } from "../../types";
import { BackupCodeForm } from "./backup-code-form";
const I18N_KEYS = {
  AUTHENTICATOR_PRIMARY_BUTTON:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_button",
  AUTHENTICATOR_SECONDARY_BUTTON:
    "webapp_account_security_settings_two_factor_authentication_turn_off_authenticator_cancel",
};
const FORM_INITIAL_VALUES = {
  code: "",
};
interface Props {
  handleClickOnSubmit: (params: {
    authenticationCode: string;
  }) => Promise<void>;
  toggleAuthenticationCodeMode: () => void;
  handleClickOnBack: () => void;
  error?: TwoFactorAuthenticationErrorWithMessage;
  login: string;
}
export const TwoFactorAuthenticationBackupCodeDialog = ({
  handleClickOnSubmit,
  toggleAuthenticationCodeMode,
  handleClickOnBack,
  error,
  login,
}: Props) => {
  const { translate } = useTranslate();
  const [localErrorMessage, setLocalErrorMessage] = useState<string>();
  useEffect(() => {
    logTwoFactorAuthenticationDisableBackupCodePageView();
  }, []);
  const formik = useFormik({
    initialValues: FORM_INITIAL_VALUES,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { code } = values;
      await handleClickOnSubmit({
        authenticationCode: code,
      });
      setSubmitting(false);
    },
  });
  const {
    values: { code },
    setFieldValue,
    isSubmitting,
  } = formik;
  useEffect(() => {
    if (error && !isSubmitting) {
      setLocalErrorMessage(error.message);
    }
  }, [error, isSubmitting]);
  const updateAuthenticatorCode = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {
      target: { value },
    } = e;
    setFieldValue("code", value);
    setLocalErrorMessage(undefined);
  };
  const disableSubmit = code.length === 0;
  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogBody>
        <BackupCodeForm
          code={code}
          errorMessage={localErrorMessage}
          updateAuthenticatorCode={updateAuthenticatorCode}
          handleAuthenticatorModeClick={toggleAuthenticationCodeMode}
          login={login}
        />
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.AUTHENTICATOR_PRIMARY_BUTTON)}
        primaryButtonProps={{
          disabled: disableSubmit,
          type: "button",
        }}
        primaryButtonOnClick={() => formik.handleSubmit()}
        secondaryButtonTitle={translate(
          I18N_KEYS.AUTHENTICATOR_SECONDARY_BUTTON
        )}
        secondaryButtonOnClick={handleClickOnBack}
      />
    </form>
  );
};
