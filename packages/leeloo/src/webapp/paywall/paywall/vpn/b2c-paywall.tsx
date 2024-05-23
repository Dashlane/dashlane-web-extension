import { jsx } from '@dashlane/design-system';
import { colors, ShieldCheckIcon, WebIcon } from '@dashlane/ui-components';
import { PremiumStatus, PremiumStatusCode } from '@dashlane/communication';
import { TranslationOptions } from 'libs/i18n/types';
import { HOTSPOT_SHIELD_URL } from 'webapp/vpn';
import { GenericPaywall, PaywallTarget } from '../generic-paywall';
import { PAYWALL_SUBTYPE } from '../../logs';
export enum VpnPaywallPlan {
    FREE = 'free',
    TRIAL = 'trial',
    ESSENTIALS = 'essentials'
}
type PaywallTranslationKeysEntry = {
    [key: string]: {
        title: string;
        description: TranslationOptions | string;
    };
};
const I18N_KEYS: PaywallTranslationKeysEntry = {
    [VpnPaywallPlan.FREE]: {
        title: 'webapp_paywall_vpn_free_title',
        description: {
            key: 'webapp_paywall_vpn_free_description_markup',
            params: {
                hotspotShield: HOTSPOT_SHIELD_URL,
            },
        },
    },
    [VpnPaywallPlan.ESSENTIALS]: {
        title: 'webapp_paywall_vpn_essentials_title',
        description: {
            key: 'webapp_paywall_vpn_essentials_description_markup',
            params: {
                hotspotShield: HOTSPOT_SHIELD_URL,
            },
        },
    },
    [VpnPaywallPlan.TRIAL]: {
        title: 'webapp_paywall_vpn_trial_title',
        description: 'webapp_paywall_vpn_trial_description',
    },
};
const getFeatures = (plan: string) => [
    {
        icon: <ShieldCheckIcon size={50} color={colors['--dash-green-02']}/>,
        key: 'privacy_feature',
        title: `webapp_paywall_vpn_${plan}_privacy_feature_title`,
        description: `webapp_paywall_vpn_${plan}_privacy_feature_text`,
    },
    {
        icon: <WebIcon size={50} color={colors['--dash-green-02']}/>,
        key: 'access_content_feature',
        title: `webapp_paywall_vpn_${plan}_access_content_feature_title`,
        description: `webapp_paywall_vpn_${plan}_access_content_feature_text`,
    },
];
const getPlan = (premiumStatus: PremiumStatus): VpnPaywallPlan | null => {
    if (premiumStatus.statusCode === PremiumStatusCode.PREMIUM) {
        return premiumStatus.planFeature === 'essentials'
            ? VpnPaywallPlan.ESSENTIALS
            : VpnPaywallPlan.TRIAL;
    }
    else {
        return premiumStatus.planType === 'free_trial'
            ? VpnPaywallPlan.TRIAL
            : VpnPaywallPlan.FREE;
    }
};
type Props = {
    premiumStatus: PremiumStatus;
    mode: 'fullscreen' | 'popup';
    closePaywall?: () => void;
};
export const B2CPaywall = ({ premiumStatus, closePaywall, mode }: Props) => {
    const plan = getPlan(premiumStatus);
    if (!plan) {
        return null;
    }
    return (<GenericPaywall closePaywall={closePaywall} description={I18N_KEYS[plan].description} target={PaywallTarget.Premium} paywallFeatures={getFeatures(plan)} mode={mode} paywallType={PAYWALL_SUBTYPE.VPN} title={I18N_KEYS[plan].title} withDefaultFooter={true}/>);
};
