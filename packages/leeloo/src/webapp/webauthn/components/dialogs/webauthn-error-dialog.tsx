import React from "react";
import classnames from "classnames";
import {
  CrossCircleIcon,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./webauthn-dialog.css";
import { allIgnoreClickOutsideClassName } from "../../../variables";
const I18N_KEYS = {
  TITLE: "webapp_account_security_settings_passwordless_error_title",
  DESCRIPTION:
    "webapp_account_security_settings_passwordless_error_description_markup",
  BUTTON_DONE:
    "webapp_account_security_settings_passwordless_error_button_done",
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface WebAuthnErrorDialogProps {
  onDone: () => void;
}
export const WebAuthnErrorDialog = ({ onDone }: WebAuthnErrorDialogProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      modalContentClassName={classnames(allIgnoreClickOutsideClassName)}
      isOpen={true}
      closeIconName={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      onClose={onDone}
      ariaLabelledby="errorDialogTitle"
      ariaDescribedby="errorDialogBody"
      disableEscapeKeyClose
      disableOutsideClickClose
      disableScrolling
      disableUserInputTrap
    >
      <div className={styles.icon}>
        <CrossCircleIcon size={60} aria-hidden="true" />
      </div>
      <DialogTitle title={translate(I18N_KEYS.TITLE)} />

      <DialogBody>
        <Paragraph id="errorDialogBody">
          {translate.markup(
            I18N_KEYS.DESCRIPTION,
            {
              utmSource: "extension",
              utmMedium: "account",
            },
            { linkTarget: "_blank" }
          )}
        </Paragraph>
      </DialogBody>

      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.BUTTON_DONE)}
        primaryButtonOnClick={onDone}
        primaryButtonProps={{ type: "button" }}
      />
    </Dialog>
  );
};
