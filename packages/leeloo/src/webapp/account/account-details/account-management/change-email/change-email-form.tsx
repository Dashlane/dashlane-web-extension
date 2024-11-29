import { useState } from "react";
import {
  Field,
  FieldProps,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from "formik";
import { AlertSeverity } from "@dashlane/ui-components";
import {
  Button,
  DSStyleObject,
  EmailField,
  mergeSx,
  Paragraph,
} from "@dashlane/design-system";
import { useModuleCommands } from "@dashlane/framework-react";
import { EditContactInfoErrorCode } from "@dashlane/communication";
import { accountManagementApi } from "@dashlane/account-contracts";
import { useAlert } from "../../../../../libs/alert-notifications/use-alert";
import { carbonConnector } from "../../../../../libs/carbon/connector";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { isValidEmail } from "../../../../../libs/validators";
import { useProtectedItemsUnlocker } from "../../../../unlock-items";
import { LockedItemType } from "../../../../unlock-items/types";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../../../libs/router";
import { useTeamPolicies } from "../../../../../libs/hooks/use-team-policies";
import {
  logChangeContactEmailCompleteEvent,
  logChangeContactEmailErrorEvent,
} from "./logs";
import { ChangeEmailFlow } from "./change-email";
import { FormFields } from "./types";
import { VerifyEmailDialog } from "./verify-email-dialog";
import { isSuccess } from "@dashlane/framework-types";
const I18N_KEYS = {
  HEADING: "webapp_change_contact_email_section_title",
  DESCRIPTION: "webapp_change_contact_email_section_description",
  CURRENT_EMAIL: "webapp_change_contact_email_current_email_label",
  NEW_CONTACT_EMAIL: "webapp_change_contact_email_new_email_label",
  NEW_LOGIN_EMAIL: "webapp_change_login_email_new_email_label",
  ACCEPTED_DOMAINS_CHANGE_LOGIN_EMAIL:
    "webapp_change_login_email_accepted_domains_label",
  CHANGE_LOGIN_EMAIL_VERIFY_NEW_EMAIL_TITLE:
    "webapp_change_login_email_verify_dialog_title",
  CHANGE_LOGIN_EMAIL_VERIFY_NEW_EMAIL_DESCRIPTION:
    "webapp_change_login_email_verify_dialog_description_markup",
  CONFIRM_CHANGE: "webapp_change_contact_email_confirm_change_button",
  ERROR_INVALID_EMAIL: "webapp_change_contact_email_error_email_format",
  LOGIN_UNAVAILABLE: "webapp_change_email_error_email_already_used",
  ERROR_RESTRICTED_EMAIL: "webapp_change_contact_email_error_restricted_email",
  ERROR_IDENTICAL_EMAIL: "webapp_change_contact_email_error_identical_email",
  ERROR_GENERIC: "webapp_change_contact_email_error_generic",
  SUCCESS_CHANGE_CONTACT_EMAIL: "webapp_change_contact_email_alert_success",
};
const I18N_KEYS_REQUIRE_MP_DIALOG = {
  TITLE: "webapp_change_contact_email_master_password_unlock_title",
  SUBTITLE: "webapp_change_contact_email_master_password_unlock_description",
  PLACEHOLDER: "webapp_change_contact_email_master_password_unlock_placeholder",
  CONFIRM: "webapp_change_contact_email_confirm_change_button",
};
export const FEEDBACK_ERROR_ID = "changeAccountEmailErrorId";
const SX_STYLES: Record<string, Partial<DSStyleObject>> = {
  EMAIL_CONTAINER: {
    minHeight: "120px",
  },
  CONFIRM_BUTTON: {
    marginTop: "0",
  },
};
const NEW_EMAIL_INPUT_ID = "account-management-change-email-new-id";
const NEW_EMAIL_FIELD_NAME = "newEmail";
const DEFAULT_FORM_VALUES: FormFields = {
  newEmail: "",
};
interface Props {
  flow: ChangeEmailFlow;
  effectiveCurrentEmail: string;
  onNavigateOut: () => void;
}
export const ChangeEmailForm = ({
  flow,
  effectiveCurrentEmail,
  onNavigateOut,
}: Props) => {
  const { translate } = useTranslate();
  const alert = useAlert();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const teamPolicies = useTeamPolicies();
  const [isChangeLoginEmailDialogOpen, setIsChangeLoginEmailDialogOpen] =
    useState(false);
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const {
    initChangeLoginEmail,
    completeChangeLoginEmail,
    resendVerificationCode,
  } = useModuleCommands(accountManagementApi);
  const restrictedDomains =
    flow === ChangeEmailFlow.LOGIN_EMAIL && teamPolicies?.teamDomain;
  const submitChangeLoginEmail = (
    newEmail: string,
    verificationCode: string
  ) => {
    void completeChangeLoginEmail({
      verificationCode,
      newEmail,
    });
    history.replace(routes.changeLoginEmail);
  };
  const cancelChangeLoginEmail = (
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(false);
    setIsChangeLoginEmailDialogOpen(false);
  };
  const handleOnSubmit = async (
    values: FormFields,
    { setSubmitting, setFieldError }: FormikHelpers<FormFields>
  ) => {
    setSubmitting(false);
    if (!isValidEmail(values.newEmail)) {
      logChangeContactEmailErrorEvent();
      setFieldError(
        NEW_EMAIL_FIELD_NAME,
        translate(I18N_KEYS.ERROR_INVALID_EMAIL)
      );
    } else if (values.newEmail === effectiveCurrentEmail) {
      logChangeContactEmailErrorEvent();
      setFieldError(
        NEW_EMAIL_FIELD_NAME,
        translate(I18N_KEYS.ERROR_IDENTICAL_EMAIL)
      );
    } else if (flow === ChangeEmailFlow.LOGIN_EMAIL) {
      if (restrictedDomains && restrictedDomains.length) {
        const newEmailDomain = values.newEmail.split("@")[1];
        if (!restrictedDomains.find((domain) => domain === newEmailDomain)) {
          return setFieldError(
            NEW_EMAIL_FIELD_NAME,
            translate(I18N_KEYS.ERROR_RESTRICTED_EMAIL)
          );
        }
      }
      try {
        const initChangeLoginEmailResult = await initChangeLoginEmail({
          newEmail: values.newEmail,
        });
        if (!isSuccess(initChangeLoginEmailResult)) {
          return setFieldError(
            NEW_EMAIL_FIELD_NAME,
            translate(
              I18N_KEYS[initChangeLoginEmailResult.error.tag] ??
                I18N_KEYS.ERROR_GENERIC
            )
          );
        }
      } catch (error) {
        return setFieldError(
          NEW_EMAIL_FIELD_NAME,
          translate(I18N_KEYS.ERROR_GENERIC)
        );
      }
      setSubmitting(true);
      setIsChangeLoginEmailDialogOpen(true);
    } else {
      setSubmitting(true);
      const submitContactForm = async () => {
        const result = await carbonConnector.editContactInfo({
          contactEmail: values.newEmail,
        });
        setSubmitting(false);
        if (result.success) {
          logChangeContactEmailCompleteEvent();
          alert.showAlert(
            translate(I18N_KEYS.SUCCESS_CHANGE_CONTACT_EMAIL),
            AlertSeverity.SUCCESS
          );
          onNavigateOut();
        } else {
          logChangeContactEmailErrorEvent();
          switch (result.error.code) {
            case EditContactInfoErrorCode.INVALID_EMAIL:
            case EditContactInfoErrorCode.EMPTY_EMAIL:
              setFieldError(
                NEW_EMAIL_FIELD_NAME,
                translate(I18N_KEYS.ERROR_INVALID_EMAIL)
              );
              break;
            case EditContactInfoErrorCode.UNKNOWN_ERROR:
            default:
              alert.showAlert(
                <Paragraph
                  textStyle="ds.body.standard.strong"
                  color="ds.text.danger.quiet"
                >
                  {translate(I18N_KEYS.ERROR_GENERIC)}
                </Paragraph>,
                AlertSeverity.ERROR
              );
          }
        }
      };
      if (!areProtectedItemsUnlocked) {
        openProtectedItemsUnlocker({
          itemType: LockedItemType.UpdateContactEmail,
          options: {
            fieldsKeys: {
              title: I18N_KEYS_REQUIRE_MP_DIALOG.TITLE,
              subtitle: I18N_KEYS_REQUIRE_MP_DIALOG.SUBTITLE,
              confirm: I18N_KEYS_REQUIRE_MP_DIALOG.CONFIRM,
              placeholder: I18N_KEYS_REQUIRE_MP_DIALOG.PLACEHOLDER,
            },
            translated: false,
          },
          successCallback: submitContactForm,
          cancelCallback: () => setSubmitting(false),
        });
      } else {
        submitContactForm();
      }
    }
  };
  return (
    <Formik onSubmit={handleOnSubmit} initialValues={DEFAULT_FORM_VALUES}>
      {({
        dirty,
        isSubmitting,
        setSubmitting,
        values,
      }: FormikProps<typeof DEFAULT_FORM_VALUES>) => {
        return (
          <>
            <Form autoComplete="off" noValidate>
              <div
                sx={mergeSx([
                  { display: "flex", flexDirection: "column" },
                  SX_STYLES.EMAIL_CONTAINER,
                ])}
              >
                <Field name={NEW_EMAIL_FIELD_NAME}>
                  {({ field, meta }: FieldProps) => (
                    <EmailField
                      id={NEW_EMAIL_INPUT_ID}
                      label={translate(
                        flow === ChangeEmailFlow.CONTACT_EMAIL
                          ? I18N_KEYS.NEW_CONTACT_EMAIL
                          : I18N_KEYS.NEW_LOGIN_EMAIL
                      )}
                      {...field}
                      value={field.value}
                      feedback={
                        meta.error
                          ? {
                              id: FEEDBACK_ERROR_ID,
                              text: meta.error,
                            }
                          : undefined
                      }
                      error={!!meta.error}
                    />
                  )}
                </Field>
                {restrictedDomains && restrictedDomains.length > 0 ? (
                  <Paragraph
                    color="ds.text.neutral.quiet"
                    sx={{ marginTop: "8px" }}
                  >
                    {`${translate(
                      I18N_KEYS.ACCEPTED_DOMAINS_CHANGE_LOGIN_EMAIL
                    )} `}
                    {restrictedDomains.map((domain, index) => (
                      <Paragraph
                        as="span"
                        key={domain}
                        textStyle="ds.body.reduced.strong"
                        color="ds.text.neutral.catchy"
                      >
                        {`${domain}${
                          index < restrictedDomains.length - 1 ? ", " : ""
                        }`}
                      </Paragraph>
                    ))}
                  </Paragraph>
                ) : null}
              </div>

              <div
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  disabled={!dirty || isSubmitting}
                  sx={SX_STYLES.CONFIRM_BUTTON}
                  type="submit"
                >
                  {translate(I18N_KEYS.CONFIRM_CHANGE)}
                </Button>
              </div>
            </Form>
            <VerifyEmailDialog
              isOpen={isChangeLoginEmailDialogOpen}
              onCancel={cancelChangeLoginEmail.bind(null, setSubmitting)}
              onSubmit={submitChangeLoginEmail.bind(null, values.newEmail)}
              resendVerificationCode={() => resendVerificationCode()}
              submitLabel={translate(I18N_KEYS.CONFIRM_CHANGE)}
              title={translate(
                I18N_KEYS.CHANGE_LOGIN_EMAIL_VERIFY_NEW_EMAIL_TITLE
              )}
              description={translate.markup(
                I18N_KEYS.CHANGE_LOGIN_EMAIL_VERIFY_NEW_EMAIL_DESCRIPTION,
                { login: values.newEmail }
              )}
            />
          </>
        );
      }}
    </Formik>
  );
};
