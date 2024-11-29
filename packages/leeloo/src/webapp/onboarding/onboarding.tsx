import React, { Fragment } from "react";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../libs/i18n/useTranslate";
import { Header } from "../components/header/header";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import zIndexesVars from "../../libs/dashlane-style/globals/z-index-variables.css";
import colorsVars from "../../libs/dashlane-style/globals/color-variables.css";
import styles from "./styles.css";
import { useShouldDisplayAdminVaultGetStartedGuide } from "../../team/settings/hooks/use-display-admin-vault-getstarted";
interface Props {
  location: Location;
}
export const Onboarding = ({
  children,
  location,
}: React.PropsWithChildren<Props>) => {
  const { translate } = useTranslate();
  const shouldDisplayAdminVaultGetStartedGuideResult =
    useShouldDisplayAdminVaultGetStartedGuide();
  const isBaseOnboardingRoute = location.href.endsWith("onboarding");
  const applyNewStyle =
    isBaseOnboardingRoute &&
    (shouldDisplayAdminVaultGetStartedGuideResult.status ===
      DataStatus.Loading ||
      (shouldDisplayAdminVaultGetStartedGuideResult.status ===
        DataStatus.Success &&
        shouldDisplayAdminVaultGetStartedGuideResult.shouldDisplayAdminVaultGetStartedGuide));
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: applyNewStyle
          ? "ds.container.agnostic.neutral.standard"
          : colorsVars["--dash-green-00"],
        color: "white",
        height: "100%",
        width: "100%",
        zIndex: zIndexesVars["--z-index-webapp-onboarding-top-level-wrapper"],
        overflowY: "auto",
        padding: "0 24px",
      }}
    >
      <Header
        endWidget={
          <>
            <HeaderAccountMenu invertColors={!applyNewStyle} />
            <NotificationsDropdown invertColors={!applyNewStyle} />
          </>
        }
      />

      <div
        sx={{
          padding: applyNewStyle ? "none" : "0 16px 16px",
          height: "100%",
          width: "100%",
          maxWidth: applyNewStyle ? "1120px" : "none",
        }}
      >
        {!applyNewStyle ? (
          <>
            <h1 className={styles.heading}>
              {translate("web_onboarding_body_title")}
            </h1>

            <p className={styles.headingCaption}>
              {translate("web_onboarding_body_text")}
            </p>
          </>
        ) : null}
        {children}
      </div>
    </div>
  );
};
