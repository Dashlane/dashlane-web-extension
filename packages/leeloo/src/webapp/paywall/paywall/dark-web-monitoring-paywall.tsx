import * as React from 'react';
import { colors, DarkWebSearchIcon, FlashingLightIcon, LightBulbIcon, } from '@dashlane/ui-components';
import { Page } from '@dashlane/hermes';
import { GenericPaywall, PaywallProps, PaywallTarget, } from 'webapp/paywall/paywall/generic-paywall';
import { PAYWALL_SUBTYPE } from 'webapp/paywall/logs';
import { logPageView } from 'libs/logs/logEvent';
const DWM_FEATURES = [
    {
        icon: <DarkWebSearchIcon size={50} color={colors['--dash-green-02']}/>,
        key: 'feature1',
        title: 'webapp_paywall_dark_web_monitor_dialog_feature1_title',
        description: 'webapp_paywall_dark_web_monitor_dialog_feature1_text',
    },
    {
        icon: <FlashingLightIcon size={50} color={colors['--dash-green-02']}/>,
        key: 'feature2',
        title: 'webapp_paywall_dark_web_monitor_dialog_feature2_title',
        description: 'webapp_paywall_dark_web_monitor_dialog_feature2_text',
    },
    {
        icon: <LightBulbIcon size={50} color={colors['--dash-green-02']}/>,
        key: 'feature3',
        title: 'webapp_paywall_dark_web_monitor_dialog_feature3_title',
        description: 'webapp_paywall_dark_web_monitor_dialog_feature3_text',
    },
];
export const DarkWebMonitoringPaywall = ({ mode, closePaywall, }: Pick<PaywallProps, 'mode' | 'closePaywall'>) => {
    React.useEffect(() => {
        logPageView(Page.PaywallDarkWebMonitoring);
    }, []);
    return (<GenericPaywall closePaywall={closePaywall} description="webapp_paywall_dark_web_monitor_dialog_subtitle" paywallFeatures={DWM_FEATURES} mode={mode} paywallType={PAYWALL_SUBTYPE.DARKWEB_MONITORING} title="webapp_paywall_dark_web_monitor_dialog_title" target={PaywallTarget.Premium} withDefaultFooter/>);
};
