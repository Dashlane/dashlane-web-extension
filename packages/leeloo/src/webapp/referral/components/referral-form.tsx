import { useState } from 'react';
import { Formik, FormikErrors, FormikHelpers, FormikProps } from 'formik';
import { Button, jsx, TextField } from '@dashlane/design-system';
import { useModuleCommands } from '@dashlane/framework-react';
import { accountReferralApi } from '@dashlane/account-contracts';
import { isFailure } from '@dashlane/framework-types';
import { Button as ButtonClickEvent, UserClickEvent } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { filterInvalidEmails, splitEmails } from '../helpers';
import { FEEDBACK_TEXT_TIMEOUT, I18N_KEYS } from '../constants';
interface FormValues {
    emails: string;
}
export const ReferralForm = () => {
    const { translate } = useTranslate();
    const [emailsFieldFeedback, setEmailsFieldFeedback] = useState('');
    const { inviteByEmail } = useModuleCommands(accountReferralApi);
    const emailsFieldPlaceholder = translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_PLACEHOLDER);
    async function handleInviteByEmailErrors(emails: string[]) {
        return await Promise.all(emails.map(async (email) => {
            const results = await inviteByEmail({ email });
            return { results, email };
        }));
    }
    async function submitHandler(values: FormValues, actions: FormikHelpers<FormValues>) {
        const emailsArr = splitEmails(values.emails);
        const resultsArr = await handleInviteByEmailErrors(emailsArr);
        const failures = resultsArr.filter((item) => isFailure(item.results));
        const hasFailure = failures.length > 0;
        if (hasFailure && emailsArr.length === 1) {
            actions.setErrors({
                emails: translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_EXISTS),
            });
            return;
        }
        if (hasFailure && emailsArr.length > 1 && failures.length === 1) {
            actions.setErrors({
                emails: translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_EXISTS_CUSTOM, {
                    email: failures[0].email,
                }),
            });
            return;
        }
        if (hasFailure && emailsArr.length > 1 && failures.length > 1) {
            const emails: string[] = [];
            failures.forEach((failure) => {
                emails.push(failure.email);
            });
            actions.setErrors({
                emails: translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_EXISTS_CUSTOM_PLURAL, { email: emails.join(', ') }),
            });
            return;
        }
        if (hasFailure) {
            actions.setErrors({
                emails: translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_GENERERIC),
            });
            return;
        }
        const hasSuccess = failures.length === 0;
        if (hasSuccess && emailsArr.length === 1) {
            setEmailsFieldFeedback(translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_SUCCESS_MSG));
            setTimeout(() => {
                setEmailsFieldFeedback('');
            }, FEEDBACK_TEXT_TIMEOUT);
        }
        if (hasSuccess && emailsArr.length > 1) {
            setEmailsFieldFeedback(translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_SUCCESS_MSG_PLURAL));
            setTimeout(() => {
                setEmailsFieldFeedback('');
            }, FEEDBACK_TEXT_TIMEOUT);
        }
        logEvent(new UserClickEvent({
            button: ButtonClickEvent.InviteReferralsByEmail,
        }));
        return actions.resetForm();
    }
    function validateHandler(values: FormValues) {
        const errors: FormikErrors<FormValues> = {};
        const emailsArr = splitEmails(values.emails);
        const invalidEmails = filterInvalidEmails(emailsArr);
        if (emailsArr.length > 4) {
            errors.emails = translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_INVITE_LIMIT);
        }
        if (invalidEmails.length === 1) {
            errors.emails = translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_INVALID);
        }
        if (invalidEmails.length > 1) {
            const emails = invalidEmails.join(', ');
            errors.emails = translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_ERROR_MSG_INVALID_PLURAL, { emails });
        }
        return errors;
    }
    return (<Formik initialValues={{
            emails: '',
        }} onSubmit={submitHandler} validate={validateHandler} validateOnChange={false}>
      {(formik: FormikProps<FormValues>) => {
            const { emails: emailsError } = formik.errors;
            const { emails: emailsValue } = formik.values;
            const getEmailsFeedback = () => {
                if (emailsError) {
                    return emailsError;
                }
                else if (!emailsError && emailsFieldFeedback) {
                    return emailsFieldFeedback;
                }
                else {
                    return;
                }
            };
            return (<form onSubmit={formik.handleSubmit}>
            <div sx={{
                    display: 'flex',
                    gap: '16px',
                }}>
              <div sx={{
                    width: '100%',
                    padding: '24px 0 32px',
                }}>
                <TextField autoFocus label={translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_TEXT_FIELD_LABEL)} onKeyDown={() => formik.setErrors({})} onChange={formik.handleChange} placeholder={emailsFieldPlaceholder} value={emailsValue} feedback={getEmailsFeedback()} error={!!emailsError} name="emails"/>
              </div>
              <Button aria-label="send" intensity="quiet" key="send" type="submit" size="large" sx={{
                    whiteSpace: 'nowrap',
                    alignSelf: 'flex-start',
                    marginTop: '28px',
                }} disabled={emailsValue.length < 6 || formik.isSubmitting} isLoading={formik.isSubmitting}>
                {translate(I18N_KEYS.REFERRAL_PAGE_SHARE_BY_EMAIL_BUTTON_TEXT)}
              </Button>
            </div>
          </form>);
        }}
    </Formik>);
};
