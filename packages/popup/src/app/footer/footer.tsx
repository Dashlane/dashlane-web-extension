import React from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import {
  Badge,
  Button,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
  jsx,
  Logo,
} from "@dashlane/design-system";
import {
  HelpCenterArticleCta,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { DashlaneLogoIcon } from "@dashlane/ui-components";
import { usePremiumStatusData } from "../../libs/api";
import {
  DASHLANE_SUPPORT_PAGE,
  openExternalUrl,
  WHATS_NEW_SUPPORT_URL,
} from "../../libs/externalUrls";
import useTranslate from "../../libs/i18n/useTranslate";
import { logEvent } from "../../libs/logs/logEvent";
import { isPremiumStatus } from "../../libs/session/premiumStatus";
import { openWebAppAndClosePopup } from "../helpers";
import { AddNewButton, SyncButton } from "./buttons";
import { FooterAlertWrapper } from "./footer-alert-hub/footer-alert-hub";
import styles from "./styles.css";
import { NewNotification } from "./whats-new/badge";
import {
  getLastSeenWhatsNewVersion,
  getLocalWhatsNewVersion,
  storeLastSeenWhatsNewVersion,
} from "./whats-new/versionUtils";
const I18N_KEYS = {
  OPEN_THE_WEB_APP: "footer_open_webapp",
  OPEN_WHATS_NEW: "footer_whats_new",
  OPEN_HELPCENTER: "footer_get_help",
  BADGE_NEW: "footer_badge_new",
  WHATS_NEW_OR_HELPCENTER_TOOLTIP: "footer_dashlane_support",
};
const SX_STYLES = {
  FOOTER: {
    display: "flex",
    backgroundColor: "ds.container.agnostic.neutral.standard",
    alignItems: "center",
    padding: "8px",
  },
  WHATS_NEW_OR_HELPCENTER: {
    width: "100%",
  },
};
const isFirstVersionHigherThanSecond = (
  first: string,
  second: string
): boolean => {
  return first > second;
};
const FooterComponent = () => {
  const { translate } = useTranslate();
  const premiumStatusData = usePremiumStatusData();
  const premiumStatus =
    premiumStatusData.status === DataStatus.Success
      ? premiumStatusData.data
      : undefined;
  const isPremiumUser = isPremiumStatus(premiumStatus?.statusCode);
  const localWhatsNewVersion = getLocalWhatsNewVersion();
  const [lastSeenWhatsNewVersion, setLastSeenWhatsNewVersion] =
    React.useState(localWhatsNewVersion);
  React.useEffect(() => {
    getLastSeenWhatsNewVersion()
      .then(setLastSeenWhatsNewVersion)
      .catch(() => {});
  }, []);
  const shouldShowNewNotification = localWhatsNewVersion
    ? lastSeenWhatsNewVersion
      ? isFirstVersionHigherThanSecond(
          localWhatsNewVersion,
          lastSeenWhatsNewVersion
        )
      : true
    : false;
  const handleOpenWebApp = () => {
    void openWebAppAndClosePopup({ route: "/onboarding" });
  };
  const handleOpenSupport = () => {
    void logEvent(
      new UserOpenHelpCenterEvent({
        helpCenterArticleCta: HelpCenterArticleCta.GetHelp,
      })
    );
    void openExternalUrl(DASHLANE_SUPPORT_PAGE);
  };
  const handleOpenWhatsNew = () => {
    setLastSeenWhatsNewVersion(localWhatsNewVersion);
    try {
      storeLastSeenWhatsNewVersion(localWhatsNewVersion);
    } catch {}
    void openExternalUrl(WHATS_NEW_SUPPORT_URL);
  };
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        bottom: "0",
        width: "100%",
      }}
    >
      <FooterAlertWrapper />
      <div className={styles.container} sx={SX_STYLES.FOOTER}>
        <Button
          mood="neutral"
          intensity="quiet"
          onClick={handleOpenWebApp}
          role="link"
          layout="iconLeading"
          size="small"
          icon={<Logo height={16} name="DashlaneMicroLogomark" />}
        >
          {translate(I18N_KEYS.OPEN_THE_WEB_APP)}
        </Button>

        <div className={styles.icons}>
          <AddNewButton />
          <DropdownMenu>
            <DropdownTriggerButton
              key="help"
              data-testid="whats_new_or_helpcenter"
              aria-label={translate(I18N_KEYS.WHATS_NEW_OR_HELPCENTER_TOOLTIP)}
              icon="FeedbackHelpOutlined"
              layout="iconLeading"
              mood="neutral"
              intensity="supershy"
            >
              {shouldShowNewNotification && (
                <NewNotification parentShape="square" />
              )}
            </DropdownTriggerButton>
            <DropdownContent>
              <DropdownItem
                leadingIcon="ActivityLogOutlined"
                label={translate(I18N_KEYS.OPEN_WHATS_NEW)}
                badge={
                  shouldShowNewNotification ? (
                    <Badge
                      label={translate(I18N_KEYS.BADGE_NEW)}
                      mood="brand"
                    />
                  ) : undefined
                }
                onSelect={handleOpenWhatsNew}
              />
              <DropdownItem
                leadingIcon="FeedbackHelpOutlined"
                label={translate(I18N_KEYS.OPEN_HELPCENTER)}
                onSelect={handleOpenSupport}
              />
            </DropdownContent>
          </DropdownMenu>
          {isPremiumUser && <SyncButton />}
        </div>
      </div>
    </div>
  );
};
export const Footer = React.memo(FooterComponent, () => true);
