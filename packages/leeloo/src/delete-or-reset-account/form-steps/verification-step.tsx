import { useState } from "react";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import { Button, Flex, Paragraph, TextField } from "@dashlane/design-system";
import {
  CompleteFlowResultErrorCode,
  UserAuthenticationMethod,
} from "@dashlane/account-contracts";
import useTranslate from "../../libs/i18n/useTranslate";
import { useDeleteOrResetAccount } from "../hooks/use-delete-or-reset-account";
type FormFields = {
  emailCode: string;
};
type FormFieldProps<T> = FieldProps<T, FormFields>;
export const I18N_KEYS = {
  TOTP_INSTRUCTIONS: "webapp_totp_instructions_deletion",
  EMAIL_DELETE_INSTRUCTIONS: "webapp_email_instructions_deletion",
  EMAIL_RESET_INSTRUCTIONS: "webapp_email_instructions_reset",
  FORM_CODE_LABEL: "webapp_form_code-label_deletion",
  FORM_SUBMIT_BUTTON_DELETE_LABEL: "webapp_form_submit_button_label_deletion",
  FORM_SUBMIT_BUTTON_RESET_LABEL: "webapp_form_submit_button_label_reset",
  FORM_GENERIC_ERROR: "webapp_form_generic_error_deletion",
  FORM_ERROR_INVALID_OTP_ALREADY_USED:
    "webapp_form_error_invalid_otp_already_used",
  FORM_ERROR_INVALID_OTP_BLOCKED: "webapp_form_error_invalid_otp_blocked",
  FORM_ERROR_ACCOUNT_BLOCKED_CONTACT_SUPPORT:
    "webapp_form_error_account_blocked_contact_support",
  FORM_ERROR_VERIFICATION_FAILED: "webapp_form_error_verification_failed",
  FORM_ERROR_VERIFICATION_REQUIRES_REQUEST:
    "webapp_form_error_verification_requires_request",
  FORM_ERROR_VERIFICATION_TIMEOUT: "webapp_form_error_verification_timeout",
};
const completeFlowError = {
  [CompleteFlowResultErrorCode.INVALID_OTP_ALREADY_USED]:
    I18N_KEYS.FORM_ERROR_INVALID_OTP_ALREADY_USED,
  [CompleteFlowResultErrorCode.INVALID_OTP_BLOCKED]:
    I18N_KEYS.FORM_ERROR_INVALID_OTP_BLOCKED,
  [CompleteFlowResultErrorCode.ACCOUNT_BLOCKED_CONTACT_SUPPORT]:
    I18N_KEYS.FORM_ERROR_ACCOUNT_BLOCKED_CONTACT_SUPPORT,
  [CompleteFlowResultErrorCode.VERIFICATION_FAILED]:
    I18N_KEYS.FORM_ERROR_VERIFICATION_FAILED,
  [CompleteFlowResultErrorCode.VERIFICATION_REQUIRES_REQUEST]:
    I18N_KEYS.FORM_ERROR_VERIFICATION_TIMEOUT,
  [CompleteFlowResultErrorCode.VERIFICATION_TIMEOUT]:
    I18N_KEYS.FORM_ERROR_VERIFICATION_TIMEOUT,
};
interface VerificationStepProps {
  isDelete: boolean;
}
const getInstructionI18NKey = (
  isDelete: boolean,
  isTOTPVerification: boolean
) => {
  if (isTOTPVerification) {
    return I18N_KEYS.TOTP_INSTRUCTIONS;
  }
  if (isDelete) {
    return I18N_KEYS.EMAIL_DELETE_INSTRUCTIONS;
  }
  return I18N_KEYS.EMAIL_RESET_INSTRUCTIONS;
};
export const VerificationStep = ({ isDelete }: VerificationStepProps) => {
  const [deletionErrorI18NKey, setDeletionErrorI18NKey] = useState<
    string | null
  >(null);
  const { completeFlow, userAuthenticationMethod } = useDeleteOrResetAccount();
  const { translate } = useTranslate();
  const handleStepOneSubmit = async (values: FormFields) => {
    try {
      const error = await completeFlow(values.emailCode, isDelete);
      if (error) {
        setDeletionErrorI18NKey(completeFlowError[error]);
      }
    } catch (error) {
      setDeletionErrorI18NKey(I18N_KEYS.FORM_GENERIC_ERROR);
    }
  };
  return (
    <>
      <Paragraph>
        {translate(
          getInstructionI18NKey(
            isDelete,
            userAuthenticationMethod === UserAuthenticationMethod.TOTP
          )
        )}
      </Paragraph>
      <Formik
        initialValues={{
          emailCode: "",
        }}
        onSubmit={handleStepOneSubmit}
      >
        {(formikProps: FormikProps<FormFields>) => (
          <Flex
            fullWidth
            flexDirection="column"
            gap="6"
            as={Form}
            autoComplete="off"
          >
            <Field name="emailCode">
              {({
                field: { onChange, ...restField },
              }: FormFieldProps<FormFields["emailCode"]>) => (
                <TextField
                  {...restField}
                  onChange={(v) => {
                    onChange(v);
                  }}
                  error={!!deletionErrorI18NKey}
                  label={translate(I18N_KEYS.FORM_CODE_LABEL)}
                  readOnly={formikProps.isSubmitting && !deletionErrorI18NKey}
                  feedback={{
                    text: deletionErrorI18NKey
                      ? translate(deletionErrorI18NKey)
                      : "",
                  }}
                />
              )}
            </Field>
            <Button
              sx={{ alignSelf: "end" }}
              icon="ActionDeleteOutlined"
              type="submit"
              mood="danger"
              intensity="catchy"
              size="large"
              layout="iconLeading"
            >
              {translate(
                isDelete
                  ? I18N_KEYS.FORM_SUBMIT_BUTTON_DELETE_LABEL
                  : I18N_KEYS.FORM_SUBMIT_BUTTON_RESET_LABEL
              )}
            </Button>
          </Flex>
        )}
      </Formik>
    </>
  );
};
