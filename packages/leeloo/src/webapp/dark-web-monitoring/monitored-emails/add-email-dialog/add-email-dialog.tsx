import * as React from "react";
import {
  DataLeaksEmail,
  DataLeaksEmailStatus,
  OptinDataLeaksResultErrorCode,
} from "@dashlane/password-security-contracts";
import { Dialog, EmailField, Infobox } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { isValidEmail } from "../../../../libs/validators";
import { OptInErrorCode } from "../../hooks/useEmailDialog";
import styles from "./styles.css";
const I18N_KEYS = {
  ERROR_ALREADY_MONITORING:
    "webapp_darkweb_add_email_dialog_error_already_monitoring",
  ERROR_ALREADY_PENDING:
    "webapp_darkweb_add_email_dialog_error_already_pending",
  ERROR_INVALID_EMAIL: "webapp_darkweb_add_email_dialog_error_invalid_email",
  ERROR_GENERIC: "webapp_darkweb_add_email_dialog_error_generic",
  INPUT_PLACEHOLDER: "webapp_darkweb_add_email_dialog_input_placeholder_text",
  FIRST_EMAIL_INFO: "webapp_darkweb_add_email_dialog_first_description_info",
};
const I18N_HAS_EMAILS_KEYS = {
  TITLE: "webapp_darkweb_add_email_dialog_title",
  DESCRIPTION: "webapp_darkweb_add_email_dialog_description_count_markup",
  CANCEL_BUTTON: "webapp_darkweb_add_email_dialog_cancel",
  CONFIRM_BUTTON: "webapp_darkweb_add_email_dialog_confirm",
};
const I18N_FIRST_EMAIL_KEYS = {
  TITLE: "webapp_darkweb_add_email_dialog_first_title",
  DESCRIPTION: "webapp_darkweb_add_email_dialog_first_description_markup",
  CANCEL_BUTTON: "webapp_darkweb_add_email_dialog_first_close",
  CONFIRM_BUTTON: "webapp_darkweb_add_email_dialog_first_confirm",
};
enum ValidationError {
  EMAIL_ALREADY_MONITORED,
  EMAIL_ALREADY_PENDING,
  NONE,
}
export interface AddEmailDialogProps {
  availableSpots: number;
  existingEmails: DataLeaksEmail[] | null;
  userLogin: string;
  error: OptInErrorCode;
  resetError: () => void;
  handleOnAddEmail: (email: string) => void;
  handleOnCloseDialog: () => void;
}
function getErrorMessageKey(error: OptInErrorCode): string | null {
  if (!error) {
    return null;
  }
  switch (error) {
    case OptinDataLeaksResultErrorCode.INVALID_EMAIL:
      return I18N_KEYS.ERROR_INVALID_EMAIL;
    case OptinDataLeaksResultErrorCode.ALREADY_SUBSCRIBED:
      return I18N_KEYS.ERROR_ALREADY_MONITORING;
    default:
      return I18N_KEYS.ERROR_GENERIC;
  }
}
export const AddEmailDialog = ({
  availableSpots,
  userLogin,
  existingEmails,
  error,
  resetError,
  handleOnAddEmail,
  handleOnCloseDialog,
}: AddEmailDialogProps) => {
  const { translate } = useTranslate();
  const hasEmails = existingEmails && existingEmails.length > 0;
  const [email, setEmail] = React.useState<string | null>(
    hasEmails ? null : userLogin
  );
  const [validationError, setValidationError] = React.useState<ValidationError>(
    ValidationError.NONE
  );
  const onEmailInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newEmail = e.target.value;
      let newValidationError = ValidationError.NONE;
      if (existingEmails && newEmail && isValidEmail(newEmail)) {
        const existingEmail = existingEmails.find(
          (item) => item.email === newEmail
        );
        if (existingEmail) {
          switch (existingEmail.state) {
            case DataLeaksEmailStatus.ACTIVE:
              newValidationError = ValidationError.EMAIL_ALREADY_MONITORED;
              break;
            case DataLeaksEmailStatus.PENDING:
              newValidationError = ValidationError.EMAIL_ALREADY_PENDING;
              break;
          }
        }
      }
      setValidationError(newValidationError);
      setEmail(newEmail);
    },
    [existingEmails, setEmail]
  );
  const onEmailInputInput = React.useCallback(() => {
    if (error !== null) {
      resetError();
    }
  }, [error, resetError]);
  const onConfirm = React.useCallback(() => {
    if (email !== null && isValidEmail(email)) {
      handleOnAddEmail(email);
    }
  }, [email, handleOnAddEmail]);
  const onSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      onConfirm();
    },
    [onConfirm]
  );
  const isEmailDisabled =
    email === null ||
    !isValidEmail(email) ||
    validationError !== ValidationError.NONE;
  const getValidationErrorMessageKey = (): string | null => {
    switch (validationError) {
      case ValidationError.EMAIL_ALREADY_MONITORED:
        return I18N_KEYS.ERROR_ALREADY_MONITORING;
      case ValidationError.EMAIL_ALREADY_PENDING:
        return I18N_KEYS.ERROR_ALREADY_PENDING;
      case ValidationError.NONE:
      default:
        return null;
    }
  };
  const emailsI18nKeys = hasEmails
    ? I18N_HAS_EMAILS_KEYS
    : I18N_FIRST_EMAIL_KEYS;
  const renderSubtitle = () => {
    const errorMessageKey =
      getErrorMessageKey(error) || getValidationErrorMessageKey();
    return (
      <div className={styles.dialog}>
        <p className={styles.description}>
          {translate.markup(emailsI18nKeys.DESCRIPTION, {
            count: availableSpots,
          })}
        </p>
        {!hasEmails && (
          <div className={styles.firstEmailInfo}>
            <Infobox title={translate(I18N_KEYS.FIRST_EMAIL_INFO)} />
          </div>
        )}
        <form onSubmit={onSubmit}>
          <EmailField
            label={translate(I18N_KEYS.INPUT_PLACEHOLDER)}
            onChange={onEmailInputChange}
            onInput={onEmailInputInput}
            value={email ?? undefined}
            error={!!errorMessageKey}
            feedback={
              errorMessageKey
                ? {
                    text: translate(errorMessageKey),
                  }
                : undefined
            }
          />
        </form>
      </div>
    );
  };
  return (
    <Dialog
      isOpen
      onClose={handleOnCloseDialog}
      title={translate(emailsI18nKeys.TITLE)}
      closeActionLabel={translate("_common_dialog_dismiss_button")}
      actions={{
        primary: {
          children: translate(emailsI18nKeys.CONFIRM_BUTTON),
          onClick: onConfirm,
          disabled: isEmailDisabled,
        },
        secondary: {
          children: translate(emailsI18nKeys.CANCEL_BUTTON),
          onClick: handleOnCloseDialog,
        },
      }}
    >
      {renderSubtitle()}
    </Dialog>
  );
};
