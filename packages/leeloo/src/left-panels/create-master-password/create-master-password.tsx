import React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { BasePanelContainer } from "../base-panel-container";
import styles from "./create-master-password.css";
const I18N_KEYS = {
  CREATE_PASSWORD_MARKETING_HEADER: "webapp_sso_to_mp_marketing_heading",
  CREATE_PASSWORD_MARKETING_SUBHEADER: "webapp_sso_to_mp_marketing_subheading",
};
export const CreateMasterPasswordMarketingContainer = () => {
  const { translate } = useTranslate();
  return (
    <BasePanelContainer>
      <div className={styles.marketingContent}>
        <div className={styles.marketingInner}>
          <h2 className={styles.heading}>
            {translate(I18N_KEYS.CREATE_PASSWORD_MARKETING_HEADER)}
          </h2>
          <h3 className={styles.subheading}>
            {translate(I18N_KEYS.CREATE_PASSWORD_MARKETING_SUBHEADER)}
          </h3>
        </div>
      </div>
    </BasePanelContainer>
  );
};
