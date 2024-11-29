import { Formik, FormikErrors, FormikHelpers, FormikProps } from "formik";
import { Button, Icon, TextField, useToast } from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { accountReferralApi } from "@dashlane/account-contracts";
import { isFailure } from "@dashlane/framework-types";
import { Button as ButtonClickEvent, UserClickEvent } from "@dashlane/hermes";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { filterInvalidEmails, splitEmails } from "../helpers";
import { I18N_KEYS } from "../constants";
interface FormValues {
  emails: string;
}
export const ReferralForm = () => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const { inviteByEmail } = useModuleCommands(accountReferralApi);
  const emailsFieldPlaceholder = translate(
    I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_PLACEHOLDER
  );
  const handleInviteByEmailErrors = async (emails: string[]) => {
    return await Promise.all(
      emails.map(async (email) => {
        const results = await inviteByEmail({ email });
        return { results, email };
      })
    );
  };
  const submitHandler = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const emailsArr = splitEmails(values.emails);
    const resultsArr = await handleInviteByEmailErrors(emailsArr);
    const failures = resultsArr.filter((item) => isFailure(item.results));
    const hasFailure = failures.length > 0;
    if (hasFailure && emailsArr.length === 1) {
      showToast({
        description: translate(
          I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_EXISTS
        ),
        mood: "danger",
      });
      return;
    }
    if (hasFailure && emailsArr.length > 1 && failures.length === 1) {
      showToast({
        description: translate(
          I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_EXISTS_CUSTOM,
          { email: failures[0].email }
        ),
        mood: "danger",
      });
      return;
    }
    if (hasFailure && emailsArr.length > 1 && failures.length > 1) {
      const emails: string[] = [];
      failures.forEach((failure) => {
        emails.push(failure.email);
      });
      showToast({
        description: translate(
          I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_EXISTS_CUSTOM_PLURAL,
          { email: emails.join(", ") }
        ),
        mood: "danger",
      });
      return;
    }
    if (hasFailure) {
      showToast({
        description: translate(
          I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_GENERERIC
        ),
        mood: "danger",
      });
      return;
    }
    const hasSuccess = failures.length === 0;
    if (hasSuccess && emailsArr.length === 1) {
      showToast({
        description: translate(
          I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_SUCCESS_MSG
        ),
      });
    }
    if (hasSuccess && emailsArr.length > 1) {
      showToast({
        description: translate(
          I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_SUCCESS_MSG_PLURAL
        ),
      });
    }
    logEvent(
      new UserClickEvent({
        button: ButtonClickEvent.InviteReferralsByEmail,
      })
    );
    return actions.resetForm();
  };
  const validateHandler = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {};
    const emailsArr = splitEmails(values.emails);
    const invalidEmails = filterInvalidEmails(emailsArr);
    if (emailsArr.length > 4) {
      errors.emails = translate(
        I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_INVITE_LIMIT
      );
    }
    if (invalidEmails.length === 1) {
      errors.emails = translate(
        I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_INVALID
      );
    }
    if (invalidEmails.length > 1) {
      const emails = invalidEmails.join(", ");
      errors.emails = translate(
        I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_INVALID_PLURAL,
        { emails }
      );
    }
    return errors;
  };
  return (
    <Formik
      initialValues={{
        emails: "",
      }}
      onSubmit={submitHandler}
      validate={validateHandler}
      validateOnChange={false}
    >
      {(formik: FormikProps<FormValues>) => {
        const { emails: emailsError } = formik.errors;
        const { emails: emailsValue } = formik.values;
        return (
          <form onSubmit={formik.handleSubmit}>
            <div
              sx={{
                display: "flex",
                gap: "16px",
              }}
            >
              <div
                sx={{
                  width: "100%",
                }}
              >
                <TextField
                  autoFocus
                  label={translate(
                    I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_LABEL
                  )}
                  onKeyDown={() => formik.setErrors({})}
                  onChange={formik.handleChange}
                  placeholder={emailsFieldPlaceholder}
                  value={emailsValue}
                  error={!!emailsError}
                  name="emails"
                  actions={[
                    <Button
                      aria-label={translate(
                        I18N_KEYS.REFERRAL_PAGE_INVITE_BY_EMAIL_BUTTON_TEXT
                      )}
                      icon={<Icon name="ArrowRightOutlined" />}
                      intensity="supershy"
                      layout="iconTrailing"
                      key="invite"
                      type="submit"
                      sx={{
                        whiteSpace: "nowrap",
                        alignSelf: "center",
                      }}
                      disabled={emailsValue.length < 6 || formik.isSubmitting}
                      isLoading={formik.isSubmitting}
                    >
                      {translate(
                        I18N_KEYS.REFERRAL_PAGE_INVITE_BY_EMAIL_BUTTON_TEXT
                      )}
                    </Button>,
                  ]}
                />
              </div>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
