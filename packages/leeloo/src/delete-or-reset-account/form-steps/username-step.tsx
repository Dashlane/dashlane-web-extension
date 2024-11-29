import { useCallback, useEffect, useState } from "react";
import { InitiateFlowResultErrorCode } from "@dashlane/account-contracts";
import { Field, FieldProps, Form, Formik, FormikProps } from "formik";
import { Button, EmailField, Flex, Paragraph } from "@dashlane/design-system";
import { useDeleteOrResetAccount } from "../hooks/use-delete-or-reset-account";
import useTranslate from "../../libs/i18n/useTranslate";
type FormFields = {
  username: string;
};
type FormFieldProps<T> = FieldProps<T, FormFields>;
export const I18N_KEYS = {
  ERROR_SSO_BLOCKED: "webapp_error_sso_blocked_deletion",
  ERROR_USER_NOT_FOUND: "webapp_error_user_not_found_deletion",
  STEP_USERNAME_DELETE_INSTRUCTIONS:
    "webapp_step_unsername_instructions_deletion",
  STEP_USERNAME_RESET_INSTRUCTIONS: "webapp_step_username_instructions_reset",
  FORM_EMAIL_LABEL: "webapp_form_email_label_deletion",
  CONTINUE_STEP_2: "webapp_continue_step_two_deletion",
};
interface UsernameStepProps {
  isDelete: boolean;
}
export const UsernameStep = ({ isDelete }: UsernameStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deletionError, setDeletionError] = useState<null | string>(null);
  const { translate } = useTranslate();
  const { initiateFlow, userAuthenticationMethod } = useDeleteOrResetAccount();
  const handleSubmit = useCallback(
    (values: FormFields) => {
      setIsLoading(true);
      initiateFlow(values.username).then((error) => {
        if (error) {
          setIsLoading(false);
        }
        switch (error) {
          case InitiateFlowResultErrorCode.UNKNOWN_USER:
            setDeletionError(I18N_KEYS.ERROR_USER_NOT_FOUND);
            break;
          case InitiateFlowResultErrorCode.SSO_BLOCKED:
            setDeletionError(I18N_KEYS.ERROR_SSO_BLOCKED);
            break;
          default:
            setDeletionError(null);
            break;
        }
      });
    },
    [initiateFlow]
  );
  useEffect(() => {
    if (userAuthenticationMethod) {
      setIsLoading(false);
    }
  }, [userAuthenticationMethod]);
  return (
    <>
      <Paragraph>
        {translate(
          isDelete
            ? I18N_KEYS.STEP_USERNAME_DELETE_INSTRUCTIONS
            : I18N_KEYS.STEP_USERNAME_RESET_INSTRUCTIONS
        )}
      </Paragraph>
      <Formik
        initialValues={{
          username: "",
        }}
        onSubmit={handleSubmit}
      >
        {(formikProps: FormikProps<FormFields>) => (
          <Flex
            fullWidth
            flexDirection="column"
            gap="6"
            as={Form}
            autoComplete="off"
          >
            <Field name="username">
              {({ field }: FormFieldProps<FormFields["username"]>) => (
                <EmailField
                  {...field}
                  error={!!deletionError}
                  readOnly={formikProps.isSubmitting && !deletionError}
                  label={translate(I18N_KEYS.FORM_EMAIL_LABEL)}
                  required
                  feedback={{
                    text: deletionError ? translate(deletionError) : "",
                  }}
                />
              )}
            </Field>

            <Button
              sx={{ alignSelf: "end" }}
              type="submit"
              mood="brand"
              intensity="catchy"
              size="large"
              isLoading={isLoading}
            >
              {translate(I18N_KEYS.CONTINUE_STEP_2)}
            </Button>
          </Flex>
        )}
      </Formik>
    </>
  );
};
