import React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { BasePanelContainer } from "../base-panel-container";
import styles from "./styles.css";
import { Paragraph } from "@dashlane/design-system";
const I18N_KEYS = {
  TITLE: "webapp_auth_panel_marketing_heading",
  SUBTITLE: "webapp_auth_panel_marketing_subtitle",
};
export const StandardMarketingContainer = () => {
  const { translate } = useTranslate();
  return (
    <BasePanelContainer>
      <div className={styles.marketingContent}>
        <div className={styles.marketingInner}>
          <Paragraph
            color="ds.text.neutral.catchy"
            textStyle="ds.specialty.brand.medium"
            style={{ marginBottom: "24px" }}
          >
            {translate(I18N_KEYS.TITLE)}
          </Paragraph>
          <Paragraph
            className={styles.subtitle}
            color="ds.text.neutral.standard"
          >
            {translate(I18N_KEYS.SUBTITLE)}
          </Paragraph>
        </div>
      </div>
    </BasePanelContainer>
  );
};
