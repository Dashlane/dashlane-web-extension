import * as React from "react";
import { InfoBox } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { DASHLANE_UPDATE_NEEDED } from "../../../../libs/externalUrls";
import styles from "./styles.css";
const I18N_KEYS = {
  UPDATE_TITLE: "login/update_title",
  UPDATE_BODY: "login/update_body_markup",
  UPDATE_BODY_SECONDARY: "login/update_body_secondary_markup",
  UPDATE_BODY_SECONDARY_UPDATE: "login/update_body_secondary_update",
  UPDATE_BODY_SECONDARY_LEARN_MORE: "login/update_body_secondary_learn_more",
};
const DashlaneUpdateNeeded = React.memo(function DashlaneUpdateNeeded() {
  const { translate } = useTranslate();
  return (
    <InfoBox
      size="simple"
      title={
        <h2 className={styles.title}>{translate(I18N_KEYS.UPDATE_TITLE)}</h2>
      }
      className={styles.infoBox}
    >
      <div className={styles.description}>
        <div className={styles.descriptionPrimary}>
          {translate(I18N_KEYS.UPDATE_BODY)}
        </div>
        <p>
          <span className={styles.boldText}>
            {translate(I18N_KEYS.UPDATE_BODY_SECONDARY_UPDATE) + " "}
          </span>
          {translate(I18N_KEYS.UPDATE_BODY_SECONDARY) + " "}
          <a href={DASHLANE_UPDATE_NEEDED}>
            {translate(I18N_KEYS.UPDATE_BODY_SECONDARY_LEARN_MORE)}
          </a>
        </p>
      </div>
    </InfoBox>
  );
});
export { DashlaneUpdateNeeded };
