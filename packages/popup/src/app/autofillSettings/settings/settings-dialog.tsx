import * as React from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import Dialog from "../../../components/dialog";
import dialogStyles from "../../../components/dialog/styles.css";
export interface SettingsDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
const I18N_KEYS = {
  CANCEL_ACTION: "tab/autofill_settings/disable_confirm/cancel_action",
  CONFIRM_ACTION: "tab/autofill_settings/disable_confirm/confirm_action",
  TITLE_SITE: "tab/autofill_settings/disable_confirm/title_site",
  DESCRIPTION: "tab/autofill_settings/disable_confirm/description",
};
const SettingsDialog = ({
  visible,
  onConfirm,
  onCancel,
}: SettingsDialogProps) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      visible={visible}
      onConfirm={onConfirm}
      onCancel={onCancel}
      cancelLabel={translate(I18N_KEYS.CANCEL_ACTION)}
      confirmLabel={translate(I18N_KEYS.CONFIRM_ACTION)}
      autoFocusAction={"cancel"}
    >
      <>
        <h2 className={dialogStyles.title} id="dialog-title">
          {translate(I18N_KEYS.TITLE_SITE)}
        </h2>
        <p className={dialogStyles.body} id="dialog-description">
          {translate(I18N_KEYS.DESCRIPTION)}
        </p>
      </>
    </Dialog>
  );
};
export default React.memo(SettingsDialog);
