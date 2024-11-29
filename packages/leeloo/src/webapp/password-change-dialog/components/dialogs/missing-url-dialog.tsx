import { ChangeEvent, MouseEventHandler, useState } from "react";
import validator from "validator";
import { Dialog, Infobox, Paragraph, TextField } from "@dashlane/design-system";
import { CredentialDetailView } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  CredentialInfo,
  CredentialInfoSize,
} from "../../../../libs/dashlane-style/credential-info/credential-info";
import { DialogProps } from "../../types";
import { allIgnoreClickOutsideClassName } from "../../../variables";
type MissingURLDialogProps = DialogProps & {
  credential: CredentialDetailView;
  onSuccess: (update: { url: string }) => Promise<void>;
};
const I18N_KEYS = {
  TITLE: "webapp_change_password_dialog_no_website_title",
  SUBTITLE: "webapp_change_password_dialog_no_website_description",
  LABEL: "webapp_change_password_dialog_no_website_add_website_input_name",
  PLACEHOLDER:
    "webapp_change_password_dialog_no_website_add_website_input_placeholder",
  FORMAT_ERROR:
    "webapp_change_password_dialog_no_website_add_website_input_format_error",
  CANCEL:
    "webapp_change_password_dialog_no_website_add_website_cancel_button_label",
  SUBMIT:
    "webapp_change_password_dialog_no_website_add_website_submit_button_label",
  SUBMIT_CONFIRM:
    "webapp_change_password_dialog_no_website_add_website_submit_confirm_button_label",
};
const FORM_ID = "missing-url-form";
export const MissingURLDialog = ({
  credential,
  onDismiss,
  onSuccess,
}: MissingURLDialogProps) => {
  const { translate } = useTranslate();
  const [error, setError] = useState(false);
  const [value, setValue] = useState("");
  const handleSubmit: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    const valid = validator.isFQDN(value) || validator.isURL(value);
    if (!valid && !error) {
      setError(true);
      return;
    }
    onSuccess({ url: value });
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target;
    setValue(input.value);
  };
  const {
    title,
    login,
    email,
    autoProtected,
    sharingStatus: { isShared: shared },
  } = credential;
  return (
    <Dialog
      isOpen
      closeActionLabel={translate(I18N_KEYS.CANCEL)}
      onClose={onDismiss}
      dialogClassName={allIgnoreClickOutsideClassName}
      actions={{
        primary: {
          children: error
            ? translate(I18N_KEYS.SUBMIT_CONFIRM)
            : translate(I18N_KEYS.SUBMIT),
          disabled: !value,
          form: FORM_ID,
          type: "submit",
          onClick: handleSubmit,
        },
        secondary: { children: translate(I18N_KEYS.CANCEL) },
      }}
      title={translate(I18N_KEYS.TITLE)}
    >
      <Paragraph
        color="ds.text.neutral.quiet"
        textStyle="ds.title.block.medium"
      >
        {translate(I18N_KEYS.SUBTITLE)}
      </Paragraph>
      <div sx={{ marginTop: "14px", marginBottom: "18px" }}>
        {title && (
          <CredentialInfo
            title={title}
            login={login}
            email={email}
            shared={shared}
            autoProtected={autoProtected}
            size={CredentialInfoSize.SMALL}
            sxProps={{
              marginBottom: "30px",
            }}
          />
        )}

        <form id={FORM_ID} role="form" autoComplete="off" noValidate={true}>
          <TextField
            label={translate(I18N_KEYS.LABEL)}
            labelPersists={false}
            autoFocus
            id="missingWebsite"
            value={value}
            onChange={handleChange}
            placeholder={translate(I18N_KEYS.PLACEHOLDER)}
            aria-describedby={error ? "missingWebsiteFormatError" : undefined}
          />
        </form>
        {error ? (
          <Infobox
            size="small"
            mood="danger"
            sx={{ marginTop: "8px" }}
            title={
              <p role="alert" id="missingWebsiteFormatError">
                {translate(
                  "webapp_change_password_dialog_no_website_add_website_input_format_error"
                )}
              </p>
            }
          />
        ) : null}
      </div>
    </Dialog>
  );
};
