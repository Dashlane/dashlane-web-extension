import * as React from "react";
import { Checkbox, DialogFooter } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import styles from "./styles.css";
const I18N_KEYS = {
  RESET_CHECKBOX_ALT:
    "webapp_family_dashboard_remove_member_dialog_body_reset_link_alt",
  RESET_LINK_TITLE:
    "webapp_family_dashboard_remove_member_dialog_body_reset_link",
  RESET_LINK_DESCRIPTION:
    "webapp_family_dashboard_remove_member_dialog_body_reset_link_description",
  CANCEL_BUTTON: "webapp_family_dashboard_remove_member_dialog_button_cancel",
  CONFIRM_BUTTON: "webapp_family_dashboard_remove_member_dialog_button_confirm",
  DIALOG_TITLE: "webapp_family_dashboard_remove_member_dialog_title",
  DIALOG_DESCRIPTION:
    "webapp_family_dashboard_remove_member_dialog_subtitle_markup",
};
export interface RemoveMemberDialogProps {
  memberLogin: string;
  handleRemoveMember: (resetLink: boolean) => void;
  handleOnCancel: () => void;
}
export const RemoveMemberDialog = ({
  memberLogin,
  handleRemoveMember,
  handleOnCancel,
}: RemoveMemberDialogProps) => {
  const { translate } = useTranslate();
  const [resetLink, setResetLink] = React.useState(true);
  const renderResetLinkAction = () => {
    return (
      <div className={styles.resetLinkWrapper}>
        <div className={styles.resetLinkCheckbox}>
          <Checkbox
            aria-label={translate(I18N_KEYS.RESET_CHECKBOX_ALT)}
            checked={resetLink}
            onChange={() => setResetLink(!resetLink)}
          />
        </div>
        <div className={styles.resetLinkDescription}>
          <p className={styles.resetLinkTitle}>
            {translate(I18N_KEYS.RESET_LINK_TITLE)}
          </p>
          <p className={styles.resetLinkSubtitle}>
            {translate(I18N_KEYS.RESET_LINK_DESCRIPTION)}
          </p>
        </div>
      </div>
    );
  };
  return (
    <SimpleDialog
      isOpen
      onRequestClose={handleOnCancel}
      footer={
        <DialogFooter
          primaryButtonTitle={translate(I18N_KEYS.CONFIRM_BUTTON)}
          primaryButtonOnClick={() => handleRemoveMember(resetLink)}
          secondaryButtonTitle={translate(I18N_KEYS.CANCEL_BUTTON)}
          secondaryButtonOnClick={handleOnCancel}
          intent="danger"
        >
          {renderResetLinkAction()}
        </DialogFooter>
      }
      title={translate(I18N_KEYS.DIALOG_TITLE)}
    >
      <p className={styles.subtitle}>
        {translate.markup(I18N_KEYS.DIALOG_DESCRIPTION, {
          login: `**${memberLogin}**`,
        })}
      </p>
    </SimpleDialog>
  );
};
