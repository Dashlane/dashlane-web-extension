import { AlertSeverity, Button, colors, FlexContainer, Paragraph, } from '@dashlane/ui-components';
import { EmailField, jsx } from '@dashlane/design-system';
import { EditContactInfoErrorCode } from '@dashlane/communication';
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps, } from 'formik';
import { useAlert } from 'libs/alert-notifications/use-alert';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { isValidEmail } from 'libs/validators';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType } from 'webapp/unlock-items/types';
import { FormFields } from './types';
import { logChangeContactEmailCompleteEvent, logChangeContactEmailErrorEvent, } from 'webapp/account/account-details/account-management/change-contact-email/logs';
const I18N_KEYS = {
    HEADING: 'webapp_change_contact_email_section_title',
    DESCRIPTION: 'webapp_change_contact_email_section_description',
    CURRENT_EMAIL: 'webapp_change_contact_email_current_email_label',
    NEW_EMAIL: 'webapp_change_contact_email_new_email_label',
    CONFIRM_CHANGE: 'webapp_change_contact_email_confirm_change_button',
    ERROR_INVALID_EMAIL: 'webapp_change_contact_email_error_email_format',
    ERROR_IDENTICAL_EMAIL: 'webapp_change_contact_email_error_identical_email',
    ERROR_GENERIC: 'webapp_change_contact_email_error_generic',
    SUCCESS_CHANGE_CONTACT_EMAIL: 'webapp_change_contact_email_alert_success',
};
const I18N_KEYS_REQUIRE_MP_DIALOG = {
    TITLE: 'webapp_change_contact_email_master_password_unlock_title',
    SUBTITLE: 'webapp_change_contact_email_master_password_unlock_description',
    PLACEHOLDER: 'webapp_change_contact_email_master_password_unlock_placeholder',
    CONFIRM: 'webapp_change_contact_email_confirm_change_button',
};
export const FEEDBACK_ERROR_ID = 'changeAccountEmailErrorId';
const SX_STYLES = {
    EMAIL_CONTAINER: {
        minHeight: '120px',
    },
    CONFIRM_BUTTON: {
        marginTop: '0',
    },
    GENERIC_ERROR_MESSAGE: {
        color: colors.functionalRed01,
    },
};
const NEW_CONTACT_EMAIL_INPUT_ID = 'account-management-change-contact-email-new-id';
const CONTACT_EMAIL_FIELD_NAME = 'contactEmail';
const DEFAULT_FORM_VALUES: FormFields = {
    contactEmail: '',
};
interface Props {
    effectiveContactEmail: string;
    onNavigateOut: () => void;
}
export const ChangeContactEmailForm = ({ effectiveContactEmail, onNavigateOut, }: Props) => {
    const { translate } = useTranslate();
    const alert = useAlert();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const handleOnSubmit = (values: FormFields, { setSubmitting, setFieldError }: FormikHelpers<FormFields>) => {
        setSubmitting(false);
        if (!isValidEmail(values.contactEmail)) {
            logChangeContactEmailErrorEvent();
            setFieldError(CONTACT_EMAIL_FIELD_NAME, translate(I18N_KEYS.ERROR_INVALID_EMAIL));
        }
        else if (values.contactEmail === effectiveContactEmail) {
            logChangeContactEmailErrorEvent();
            setFieldError(CONTACT_EMAIL_FIELD_NAME, translate(I18N_KEYS.ERROR_IDENTICAL_EMAIL));
        }
        else {
            setSubmitting(true);
            const submitContactForm = async () => {
                const result = await carbonConnector.editContactInfo({
                    contactEmail: values.contactEmail,
                });
                setSubmitting(false);
                if (result.success) {
                    logChangeContactEmailCompleteEvent();
                    alert.showAlert(translate(I18N_KEYS.SUCCESS_CHANGE_CONTACT_EMAIL), AlertSeverity.SUCCESS);
                    onNavigateOut();
                }
                else {
                    logChangeContactEmailErrorEvent();
                    switch (result.error.code) {
                        case EditContactInfoErrorCode.INVALID_EMAIL:
                        case EditContactInfoErrorCode.EMPTY_EMAIL:
                            setFieldError(CONTACT_EMAIL_FIELD_NAME, translate(I18N_KEYS.ERROR_INVALID_EMAIL));
                            break;
                        case EditContactInfoErrorCode.UNKNOWN_ERROR:
                        default:
                            alert.showAlert(<Paragraph bold sx={SX_STYLES.GENERIC_ERROR_MESSAGE}>
                  {translate(I18N_KEYS.ERROR_GENERIC)}
                </Paragraph>, AlertSeverity.ERROR);
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
            }
            else {
                submitContactForm();
            }
        }
    };
    return (<Formik onSubmit={handleOnSubmit} initialValues={DEFAULT_FORM_VALUES}>
      {({ dirty, isSubmitting }: FormikProps<typeof DEFAULT_FORM_VALUES>) => {
            return (<Form autoComplete="off" noValidate>
            <FlexContainer sx={SX_STYLES.EMAIL_CONTAINER} flexDirection="column">
              <Field name={CONTACT_EMAIL_FIELD_NAME}>
                {({ field, meta }: FieldProps) => (<EmailField id={NEW_CONTACT_EMAIL_INPUT_ID} label={translate(I18N_KEYS.NEW_EMAIL)} {...field} value={field.value} feedback={meta.error
                        ? {
                            id: FEEDBACK_ERROR_ID,
                            text: meta.error,
                        }
                        : undefined} error={!!meta.error}/>)}
              </Field>
            </FlexContainer>

            <FlexContainer justifyContent="flex-end">
              <Button disabled={!dirty || isSubmitting} sx={SX_STYLES.CONFIRM_BUTTON} type="submit">
                {translate(I18N_KEYS.CONFIRM_CHANGE)}
              </Button>
            </FlexContainer>
          </Form>);
        }}
    </Formik>);
};
