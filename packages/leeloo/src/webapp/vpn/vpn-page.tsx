import { useEffect } from "react";
import { Flex, Heading } from "@dashlane/design-system";
import { colors, Eyebrow } from "@dashlane/ui-components";
import { browser } from "@dashlane/browser-utils";
import { PageView } from "@dashlane/hermes";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { redirect } from "../../libs/router";
import { logPageView } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import { usePremiumStatus } from "../../libs/carbon/hooks/usePremiumStatus";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { VpnFaq } from "./components/vpn-faq";
import { Header } from "../components/header/header";
import { VpnInfoBox } from "./components/vpn-infobox";
import { VpnAccountActivation } from "./containers/vpn-account-activation";
import { VpnInstallHotspotshield } from "./components/vpn-install-hotspotshield";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { VpnExtensionOnboarding } from "./components/vpn-extension-onboarding";
import { PersonalDataSectionView } from "../personal-data-section-view/personal-data-section-view";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { PaywallManager, PaywallName } from "../paywall";
import { useVpnPageAccess } from "./hooks";
import { useVpnCredential } from ".";
const I18N_KEYS = {
  VPN_PAGE_TITLE: "webapp_vpn_page_title",
  ACTIVATE: {
    EYEBROW: "webapp_vpn_page_credential_activate_eyebrow",
  },
};
export const VpnPage = () => {
  const { translate } = useTranslate();
  const premiumStatus = usePremiumStatus();
  const vpnCredential = useVpnCredential();
  const vpnPageAccess = useVpnPageAccess();
  const { routes } = useRouterGlobalSettingsContext();
  useEffect(() => {
    if (vpnPageAccess?.showVpnPage) {
      logPageView(PageView.ToolsVpn);
    }
  }, [vpnPageAccess?.showVpnPage]);
  if (
    premiumStatus.status !== DataStatus.Success ||
    vpnPageAccess?.showVpnPage === undefined ||
    vpnPageAccess?.vpnPageAccessLoading
  ) {
    return null;
  }
  if (!vpnPageAccess.showVpnPage) {
    redirect(routes.userCredentials);
    return null;
  }
  return (
    <PersonalDataSectionView>
      <PaywallManager mode="fullscreen" paywall={PaywallName.Vpn}>
        {!APP_PACKAGED_IN_EXTENSION && !browser.isSafari() ? (
          <VpnExtensionOnboarding />
        ) : (
          <Flex
            flexDirection="column"
            sx={{
              backgroundColor: "ds.background.alternate",
              paddingTop: "16px",
              height: "100%",
              overflowY: "scroll",
              flexWrap: "nowrap",
            }}
          >
            <Header
              sx={{ paddingLeft: "32px", paddingRight: "32px" }}
              startWidgets={
                <Flex flexDirection="column">
                  <Heading
                    as="h1"
                    textStyle="ds.title.section.large"
                    color="ds.text.neutral.catchy"
                  >
                    {translate(I18N_KEYS.VPN_PAGE_TITLE)}
                  </Heading>
                </Flex>
              }
              endWidget={
                <>
                  <HeaderAccountMenu />
                  <NotificationsDropdown />
                </>
              }
            />
            <Flex flexDirection="column" sx={{ padding: "0px 32px" }}>
              <VpnInfoBox premiumStatus={premiumStatus.data} />

              <section>
                <Eyebrow sx={{ color: colors.grey00 }}>
                  {translate(I18N_KEYS.ACTIVATE.EYEBROW)}
                </Eyebrow>
                <VpnAccountActivation
                  stepNumber={1}
                  vpnCredential={vpnCredential}
                />
                <VpnInstallHotspotshield
                  stepNumber={2}
                  vpnCredential={vpnCredential}
                />
              </section>
              <VpnFaq />
            </Flex>
          </Flex>
        )}
      </PaywallManager>
    </PersonalDataSectionView>
  );
};
