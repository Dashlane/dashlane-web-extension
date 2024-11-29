import classnames from "classnames";
import React, { useEffect } from "react";
import { Link } from "../../../../../libs/router";
import {
  BackIcon,
  colors,
  MagicWandIcon,
  OpenWebsiteIcon,
} from "@dashlane/ui-components";
import { openWebOnboardingTab, setOnboardingMode } from "../../../services";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../../../../libs/router/RouterGlobalSettingsProvider";
import containerStyles from "../../styles.css";
import styles from "./styles.css";
import { logPageView } from "../../../../../libs/logs/logEvent";
import { PageView } from "@dashlane/hermes";
const backArrowIcon = (
  <BackIcon color={colors.dashGreen00} size={20} viewBox="0 2 20 20" />
);
const tryAutofillIcon = (
  <MagicWandIcon color={colors.dashGreen02} size={20} viewBox="0 0 40 40" />
);
const openWebsiteIcon = (
  <OpenWebsiteIcon color={colors.orange00} size={20} viewBox="0 2 20 20" />
);
export const StorePersonalInfo = () => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const tryAutofillUrl = "__REDACTED__";
  const openChosenSite = () => {
    openWebOnboardingTab(tryAutofillUrl);
  };
  const onBackArrowIconClick = () => {
    setOnboardingMode();
  };
  useEffect(() => {
    logPageView(PageView.HomeOnboardingChecklistTryAutofillStorePersonalInfo);
  }, []);
  return (
    <div className={classnames(containerStyles.container, styles.container)}>
      <div className={containerStyles.routeContainer}>
        <Link
          to={routes.userOnboarding}
          className={containerStyles.arrowBtnContainer}
          onClick={onBackArrowIconClick}
        >
          {backArrowIcon}
        </Link>
        <div className={styles.tryAutofillIcon}>{tryAutofillIcon}</div>
        <h2 className={containerStyles.actionText}>
          {translate("web_onboarding_card_try_autofill")}
        </h2>
      </div>
      <div className={containerStyles.subContainer}>
        <h2 className={containerStyles.title}>
          {translate("web_onboarding_card_try_autofill_title")}
        </h2>
        <p
          className={classnames(
            containerStyles.description,
            styles.description
          )}
        >
          {translate("web_onboarding_card_try_autofill_description")}
        </p>
        <button className={styles.storeInfoButton} onClick={openChosenSite}>
          <h2 className={styles.title}>
            {translate("web_onboarding_card_try_autofill_body_text")}
          </h2>
          <div className={styles.openWebsiteIcon}>{openWebsiteIcon}</div>
        </button>
      </div>
    </div>
  );
};
