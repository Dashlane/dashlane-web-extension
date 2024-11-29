import * as React from "react";
import { InfoCircleIcon } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import colorVars from "../../libs/dashlane-style/globals/color-variables.css";
import styles from "./styles.css";
const I18N_KEYS = {
  TITLE: "family_invitee_page_form_privacy_note_title",
  DESCRIPTION: "family_invitee_page_form_privacy_note_description_markup",
};
export const PrivacyNote = () => {
  const { translate } = useTranslate();
  return (
    <div className={styles.wrapper}>
      <p className={styles.titleSection}>
        <InfoCircleIcon color={colorVars["--dash-green-00"]} />
        <span className={styles.title}>{translate(I18N_KEYS.TITLE)}</span>
      </p>
      <p className={styles.description}>
        {translate.markup(I18N_KEYS.DESCRIPTION)}
      </p>
    </div>
  );
};
