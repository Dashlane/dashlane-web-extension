import * as React from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../libs/dashlane-style/dialogs/simple/simple-dialog";
export const StepDialogWithTitle = ({
  children,
  onRequestClose,
  footer,
}: React.PropsWithChildren<{
  onRequestClose: () => void;
  footer?: React.ReactNode;
}>) => {
  const { translate } = useTranslate();
  const dialogTitle = translate("team_directory_sync_key_dialog_title");
  return (
    <SimpleDialog
      isOpen
      showCloseIcon
      onRequestClose={onRequestClose}
      footer={footer}
      title={dialogTitle}
    >
      {children}
    </SimpleDialog>
  );
};
