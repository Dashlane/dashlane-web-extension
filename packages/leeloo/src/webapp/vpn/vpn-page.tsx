import { Fragment, useEffect } from 'react';
import { colors, Eyebrow, FlexContainer, Heading, jsx, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { PageView } from '@dashlane/hermes';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { VpnAccountActivation } from './containers/vpn-account-activation';
import { VpnInfoBox } from './components/vpn-infobox';
import { VpnInstallHotspotshield } from './components/vpn-install-hotspotshield';
import { VpnFaq } from './components/vpn-faq';
import { logPageView } from 'libs/logs/logEvent';
import { useVpnCredential } from 'webapp/vpn';
import { useVpnPageAccess } from './hooks';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { PaywallManager, PaywallName } from 'webapp/paywall';
import { VpnExtensionOnboarding } from './components/vpn-extension-onboarding';
import { browser } from '@dashlane/browser-utils';
import { Header } from 'webapp/components/header/header';
import { Connected as NotificationsDropdown } from 'webapp/bell-notifications/connected';
import { HeaderAccountMenu } from 'webapp/components/header/header-account-menu';
const I18N_KEYS = {
    VPN_PAGE_TITLE: 'webapp_vpn_page_title',
    ACTIVATE: {
        EYEBROW: 'webapp_vpn_page_credential_activate_eyebrow',
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
    if (premiumStatus.status !== DataStatus.Success ||
        vpnPageAccess?.showVpnPage === undefined ||
        vpnPageAccess?.vpnPageAccessLoading) {
        return null;
    }
    if (!vpnPageAccess.showVpnPage) {
        redirect(routes.userCredentials);
        return null;
    }
    return (<PersonalDataSectionView>
      <PaywallManager mode="fullscreen" paywall={PaywallName.Vpn}>
        {!APP_PACKAGED_IN_EXTENSION && !browser.isSafari() ? (<VpnExtensionOnboarding />) : (<FlexContainer flexDirection="column" sx={{
                bg: colors.dashGreen06,
                paddingTop: '16px',
                height: '100%',
                overflowY: 'scroll',
                flexWrap: 'nowrap',
            }}>
            <Header startWidgets={() => (<FlexContainer flexDirection="column">
                  <Heading>{translate(I18N_KEYS.VPN_PAGE_TITLE)}</Heading>
                </FlexContainer>)} endWidget={<>
                  <HeaderAccountMenu />
                  <NotificationsDropdown />
                </>}/>
            <FlexContainer flexDirection="column" sx={{ padding: '0px 32px' }}>
              <VpnInfoBox premiumStatus={premiumStatus.data}/>

              <section>
                <Eyebrow sx={{ color: colors.grey00 }}>
                  {translate(I18N_KEYS.ACTIVATE.EYEBROW)}
                </Eyebrow>
                <VpnAccountActivation stepNumber={1} vpnCredential={vpnCredential}/>
                <VpnInstallHotspotshield stepNumber={2} vpnCredential={vpnCredential}/>
              </section>
              <VpnFaq />
            </FlexContainer>
          </FlexContainer>)}
      </PaywallManager>
    </PersonalDataSectionView>);
};
