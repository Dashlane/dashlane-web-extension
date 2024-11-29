import React from "react";
import classNames from "classnames";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
  MagicWandIcon,
} from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import styles from "./mp-activated-dialog.css";
const I18N_KEYS = {
  MP_ACTIVATED_TITLE: "mp_activated_popup_title",
  MP_ACTIVATED_TEXT_1: "mp_activated_popup_text_1",
  MP_ACTIVATED_TEXT_2: "mp_activated_popup_text_2_markup",
  MP_ACTIVATED_PRIMARY_BUTTON: "mp_activated_popup_primary_button",
  CLOSE: "_common_dialog_dismiss_button",
};
export const MPActivatedDialog = () => {
  const { translate } = useTranslate();
  const [isOpen, setIsOpen] = React.useState(true);
  return (
    <Dialog
      closeIconName={translate(I18N_KEYS.CLOSE)}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className={styles.dialogContainer}>
        <DialogTitle>
          <div className={styles.mpActivatedTitleContainer}>
            <MagicWandIcon size={30} />
            <h2 className={styles.mpActivatedTitle}>
              {translate(I18N_KEYS.MP_ACTIVATED_TITLE)}
            </h2>
          </div>
        </DialogTitle>
        <DialogBody>
          <p className={styles.mpActivatedText}>
            {translate(I18N_KEYS.MP_ACTIVATED_TEXT_1)}
          </p>
          <p
            className={classNames(
              styles.mpActivatedText,
              styles.mpActivatedSecondaryText
            )}
          >
            {translate.markup(I18N_KEYS.MP_ACTIVATED_TEXT_2)}
          </p>
        </DialogBody>
        <DialogFooter
          primaryButtonOnClick={() => setIsOpen(false)}
          primaryButtonTitle={translate(I18N_KEYS.MP_ACTIVATED_PRIMARY_BUTTON)}
        />
      </div>
    </Dialog>
  );
};
