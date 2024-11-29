import { CheckCircleIcon } from "@dashlane/ui-components";
import { Dialog, Heading, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./webauthn-dialog.css";
import { allIgnoreClickOutsideClassName } from "../../../variables";
const I18N_KEYS = {
  ALL_AUTHENTICATORS_TITLE:
    "webapp_account_security_settings_passwordless_confirm_enable_all_authenticators_title",
  ALL_AUTHENTICATORS_DESC:
    "webapp_account_security_settings_passwordless_confirm_enable_all_authenticators_description_markup",
  NO_PLATFORM_TITLE:
    "webapp_account_security_settings_passwordless_confirm_enable_noplatform_title",
  NO_PLATFORM_DESC:
    "webapp_account_security_settings_passwordless_confirm_enable_noplatform_description_markup",
  BUTTON_DONE:
    "webapp_account_security_settings_passwordless_confirm_enable_button_done",
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface ConfirmEnableWebAuthnDialogProps {
  userHasWebAuthnPlatformAuthenticator: boolean | null;
  onDone: () => void;
}
export const ConfirmEnableWebAuthnDialog = ({
  userHasWebAuthnPlatformAuthenticator,
  onDone,
}: ConfirmEnableWebAuthnDialogProps) => {
  const { translate } = useTranslate();
  const title = userHasWebAuthnPlatformAuthenticator
    ? I18N_KEYS.ALL_AUTHENTICATORS_TITLE
    : I18N_KEYS.NO_PLATFORM_TITLE;
  const description = userHasWebAuthnPlatformAuthenticator
    ? I18N_KEYS.ALL_AUTHENTICATORS_DESC
    : I18N_KEYS.NO_PLATFORM_DESC;
  return (
    <Dialog
      title={""}
      isOpen={true}
      onClose={onDone}
      actions={{
        primary: {
          children: translate(I18N_KEYS.BUTTON_DONE),
          onClick: onDone,
        },
      }}
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      dialogClassName={allIgnoreClickOutsideClassName}
      aria-describedby="confirmEnableDialogBody"
    >
      <div className={styles.icon}>
        <CheckCircleIcon size={60} aria-hidden="true" />
      </div>

      <Heading as="h2"> {translate(title)}</Heading>
      <Paragraph id="confirmEnableDialogBody" color="ds.text.neutral.quiet">
        {translate.markup(description)}
      </Paragraph>
    </Dialog>
  );
};
