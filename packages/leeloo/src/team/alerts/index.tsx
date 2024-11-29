import * as React from "react";
import { DialogFooter } from "@dashlane/ui-components";
import { SimpleDialog } from "../../libs/dashlane-style/dialogs/simple/simple-dialog";
import useTranslate from "../../libs/i18n/useTranslate";
import { useAlertQueue } from "./use-alert-queue";
const I18N_KEYS = {
  ALERT_DISMISS_BUTTON: "_common_alert_dismiss_button",
};
export const AlertQueue = () => {
  const { translate } = useTranslate();
  const { queue, popAlertFromQueue } = useAlertQueue();
  const handleDismiss = () => {
    popAlertFromQueue();
  };
  const [displayAlert] = queue;
  if (!displayAlert) {
    return null;
  }
  return (
    <SimpleDialog
      isOpen
      onRequestClose={handleDismiss}
      footer={
        <DialogFooter
          secondaryButtonTitle={
            displayAlert.okButtonLabel ??
            translate(I18N_KEYS.ALERT_DISMISS_BUTTON)
          }
          secondaryButtonOnClick={handleDismiss}
        />
      }
      title={displayAlert.title}
    >
      <div>{displayAlert.message}</div>
    </SimpleDialog>
  );
};
