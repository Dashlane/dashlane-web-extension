import React from "react";
import {
  colors,
  DialogFooter,
  InfoBox,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
export const I18N_KEYS = {
  TITLE: "webapp_account_export_personal_data_title",
  SUBTITLE: "webapp_account_export_personal_data_subtitle",
  WARNING: "webapp_account_export_personal_data_warning",
  CANCEL: "webapp_account_export_personal_data_cancel",
  CONTINUE: "webapp_account_export_personal_data_continue",
};
export interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
}
export const ExportWarningDialog = ({
  isOpen,
  onDismiss,
  onConfirm,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <SimpleDialog
      isOpen={isOpen}
      disableBackgroundPanelClose
      onRequestClose={onDismiss}
      title={translate(I18N_KEYS.TITLE)}
      footer={
        <DialogFooter
          primaryButtonTitle={translate(I18N_KEYS.CONTINUE)}
          primaryButtonOnClick={onConfirm}
          secondaryButtonTitle={translate(I18N_KEYS.CANCEL)}
          secondaryButtonOnClick={onDismiss}
        />
      }
    >
      <Paragraph color={colors.dashGreen01}>
        {translate(I18N_KEYS.SUBTITLE)}
      </Paragraph>
      <InfoBox
        sx={{ marginTop: "16px" }}
        size="small"
        title={translate(I18N_KEYS.WARNING)}
      />
    </SimpleDialog>
  );
};
