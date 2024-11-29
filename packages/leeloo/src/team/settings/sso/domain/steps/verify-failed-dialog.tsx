import * as React from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
} from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  FAILURE_TITLE: "team_settings_domain_verify_failure_title",
  FAILURE_TITLE_MARKUP: "team_settings_domain_verify_failure_title_markup",
  FAILURE_BUTTON: "team_settings_domain_verify_failure_button",
  FAILURE_DESCRIPTION: "team_settings_domain_verify_failure_desc",
};
interface VerifyFailedDialogProps {
  domainName?: string;
  onDismiss: () => void;
}
export const VerifyFailedDialog = ({
  onDismiss,
  domainName,
}: VerifyFailedDialogProps) => {
  const { translate } = useTranslate();
  const dialogTitle = domainName
    ? translate.markup(I18N_KEYS.FAILURE_TITLE_MARKUP, {
        domainUrl: domainName,
      })
    : translate(I18N_KEYS.FAILURE_TITLE);
  return (
    <Dialog isOpen onClose={onDismiss}>
      <DialogTitle title={dialogTitle} />
      <DialogBody>{translate(I18N_KEYS.FAILURE_DESCRIPTION)}</DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.FAILURE_BUTTON)}
        primaryButtonOnClick={onDismiss}
        intent="primary"
      />
    </Dialog>
  );
};
