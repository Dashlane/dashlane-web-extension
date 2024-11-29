import { DialogFooter } from "@dashlane/ui-components";
import React from "react";
import { SimpleDialog } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { DialogAction } from "../../sso/types";
export interface DialogProps {
  closeDialog: (dialogAction: DialogAction) => void;
}
const I18N_KEYS = {
  DIALOG_TITLE: "team_settings_enable_sso_dialog_disable_title",
  DIALOG_DESCRIPTION: "team_settings_enable_sso_dialog_disable_description",
  DIALOG_ACTION: "team_settings_enable_sso_dialog_disable_action",
  DIALOG_CANCEL: "team_settings_enable_sso_cancel",
};
export const DisableSsoDialog = ({ closeDialog }: DialogProps) => {
  const { translate } = useTranslate();
  return (
    <SimpleDialog
      isOpen
      onRequestClose={() => closeDialog(DialogAction.dismiss)}
      footer={
        <DialogFooter
          primaryButtonTitle={translate(I18N_KEYS.DIALOG_ACTION)}
          primaryButtonOnClick={() => closeDialog(DialogAction.action)}
          secondaryButtonTitle={translate(I18N_KEYS.DIALOG_CANCEL)}
          secondaryButtonOnClick={() => closeDialog(DialogAction.dismiss)}
          intent="danger"
        />
      }
      title={translate(I18N_KEYS.DIALOG_TITLE)}
    >
      {translate(I18N_KEYS.DIALOG_DESCRIPTION)}
    </SimpleDialog>
  );
};
