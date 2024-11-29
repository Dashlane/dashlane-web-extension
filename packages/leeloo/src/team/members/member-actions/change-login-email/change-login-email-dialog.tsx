import { Form, Formik } from "formik";
import { useState } from "react";
import { TeamMemberInfo } from "@dashlane/communication";
import {
  Dialog,
  EmailField,
  Paragraph,
  useToast,
} from "@dashlane/design-system";
import { useTeamPolicies } from "../../../../libs/hooks/use-team-policies";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { isValidEmail } from "../../../../libs/validators";
import { FEEDBACK_ERROR_ID } from "../../../../webapp/account/account-details/account-management/change-email/change-email-form";
export const I18N_KEYS = {
  DIALOG_TITLE: "webapp_change_login_email_section_title",
  DIALOG_DESCRIPTION: "webapp_change_login_email_tac_description_markup",
  CURRENT_LOGIN_EMAIL_LABEL:
    "webapp_change_login_email_tac_current_email_label",
  NEW_LOGIN_EMAIL_LABEL: "webapp_change_login_email_new_email_label",
  CLOSE_DIALOG_BUTTON_LABEL: "_common_dialog_dismiss_button",
  CHANGE_EMAIL_BUTTON: "webapp_change_login_email_change_email_button",
  CANCEL_BUTTON: "_common_action_cancel",
  CHANGE_LOGIN_EMAIL_CONFIRMATION_DESCRIPTION:
    "webapp_change_login_email_tac_confirmation_toast",
  ACCEPTED_DOMAINS_CHANGE_LOGIN_EMAIL_FIRST_PART:
    "webapp_change_login_email_tac_accepted_domain_first_part",
  ACCEPTED_DOMAINS_CHANGE_LOGIN_EMAIL_SECOND_PART:
    "webapp_change_login_email_tac_accepted_domain_second_part",
};
const I18N_ERROR_KEYS = {
  IDENTICAL_EMAIL: "webapp_change_contact_email_error_identical_email",
  INVALID_EMAIL: "webapp_change_contact_email_error_email_format",
  GENERIC_ERROR: "webapp_change_contact_email_error_generic",
  ERROR_RESTRICTED_EMAIL: "webapp_change_contact_email_error_restricted_email",
  ALREADY_USED: "webapp_change_contact_email_error_already_used",
};
const checkEmailForError = (
  newEmail: string,
  selectedMembers: string,
  restrictedDomains: any[] | undefined
) => {
  const newEmailDomain = newEmail.split("@")[1];
  if (!isValidEmail(newEmail)) {
    return "INVALID_EMAIL";
  }
  if (newEmail === selectedMembers) {
    return "IDENTICAL_EMAIL";
  }
  if (
    restrictedDomains &&
    restrictedDomains.length &&
    !restrictedDomains.find((domain) => domain === newEmailDomain)
  ) {
    return "ERROR_RESTRICTED_EMAIL";
  }
  return null;
};
export const ChangeLoginEmailDialog = ({
  closeDialog,
  selectedMembers,
}: {
  closeDialog: () => void;
  selectedMembers: TeamMemberInfo[];
}) => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [error, setError] = useState("");
  const restrictedDomains = useTeamPolicies()?.teamDomain;
  const handleNewEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewEmail(value);
    setError("");
  };
  const handleNewEmailSubmit = (email: string) => {
    const error = checkEmailForError(
      email,
      selectedMembers[0].login,
      restrictedDomains
    );
    if (error) {
      setError(error);
    } else {
      closeDialog();
      showToast({
        description: translate(
          I18N_KEYS.CHANGE_LOGIN_EMAIL_CONFIRMATION_DESCRIPTION
        ),
      });
    }
  };
  return (
    <Formik
      initialValues={{ email: newEmail }}
      onSubmit={() => handleNewEmailSubmit(newEmail)}
    >
      <Dialog
        isOpen={true}
        onClose={closeDialog}
        title={translate(I18N_KEYS.DIALOG_TITLE)}
        closeActionLabel={translate(I18N_KEYS.CLOSE_DIALOG_BUTTON_LABEL)}
        actions={{
          primary: {
            children: translate(I18N_KEYS.CHANGE_EMAIL_BUTTON),
            type: "submit",
            onClick: () => handleNewEmailSubmit(newEmail),
            disabled: !newEmail,
          },
          secondary: {
            children: translate(I18N_KEYS.CANCEL_BUTTON),
            onClick: closeDialog,
          },
        }}
      >
        <Paragraph>{translate.markup(I18N_KEYS.DIALOG_DESCRIPTION)}</Paragraph>
        <EmailField
          label={translate(I18N_KEYS.CURRENT_LOGIN_EMAIL_LABEL)}
          value={selectedMembers[0].login}
          readOnly
        />

        <Form>
          <EmailField
            label={translate(I18N_KEYS.NEW_LOGIN_EMAIL_LABEL)}
            error={!!error}
            autoFocus
            onChange={handleNewEmailChange}
            value={newEmail}
            feedback={
              error
                ? {
                    id: FEEDBACK_ERROR_ID,
                    text: translate(
                      I18N_ERROR_KEYS[error] ??
                        translate(I18N_ERROR_KEYS.GENERIC_ERROR)
                    ),
                  }
                : undefined
            }
          />
        </Form>

        {restrictedDomains && restrictedDomains.length > 0 ? (
          <Paragraph
            color="ds.text.neutral.quiet"
            textStyle="ds.body.helper.regular"
          >
            {`${translate(
              I18N_KEYS.ACCEPTED_DOMAINS_CHANGE_LOGIN_EMAIL_FIRST_PART
            )} `}
            <Paragraph
              as="span"
              textStyle="ds.body.helper.regular"
              color="ds.text.neutral.catchy"
              sx={{ fontWeight: "bold" }}
            >
              {`${restrictedDomains.join(", ")}.`}
            </Paragraph>
            <br />
            {translate(
              I18N_KEYS.ACCEPTED_DOMAINS_CHANGE_LOGIN_EMAIL_SECOND_PART
            )}
          </Paragraph>
        ) : null}

        <Paragraph textStyle="ds.body.helper.regular"></Paragraph>
      </Dialog>
    </Formik>
  );
};
