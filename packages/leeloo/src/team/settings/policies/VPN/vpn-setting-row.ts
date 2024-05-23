import { Button, ClickOrigin, UserClickEvent } from '@dashlane/hermes';
import { Policies, SpaceTier } from '@dashlane/team-admin-contracts';
import { openUrl } from 'libs/external-urls';
import { TranslateFunction } from 'libs/i18n/types';
import { logEvent } from 'libs/logs/logEvent';
import { redirect } from 'libs/router';
import { UseBuyOrUpgradePaywallDetailsResult } from 'team/helpers/use-buy-or-upgrade-paywall-details';
import { BUSINESS_BUY } from 'team/urls';
import { NamedRoutes } from 'app/routes/types';
import { SettingRowModel } from '../types';
const POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE = 'button:buy_dashlane+click_origin:vpn_feature_activation_setting+origin_page:tac/settings/policies+origin_component:main_app';
const I18N_KEYS = {
    TEAM_SETTINGS_TOO_MANY_REQUESTS: 'team_settings_too_many_requests',
    TEAM_SETTINGS_AVAILABLE_IN_PAID_SUBSCRIPTION: 'team_settings_available_in_paid_subscription_badge',
    TEAM_SETTINGS_UPGRADE: 'team_settings_upgrade_badge',
    BUY_DASHLANE_CTA: 'team_settings_buy_dashlane_cta',
    SEE_PLANS_CTA: 'team_settings_see_plans_cta',
    TEAM_SETTINGS_VPN: 'team_settings_vpn',
    TEAM_SETTINGS_VPN_HELPER: 'team_settings_vpn_helper',
    TEAM_SETTINGS_VPN_DISABLED_FREE_TRIAL: 'team_settings_vpn_disabled_for_free_trial',
    TEAM_SETTINGS_VPN_DISABLED_GENERIC_ERROR: 'team_settings_vpn_save_error_msg_generic_error',
};
export const getVPNSettingRow = (showPaywallInfo: UseBuyOrUpgradePaywallDetailsResult, translate: TranslateFunction, policies: Policies, routes: NamedRoutes): SettingRowModel => {
    const { shouldShowBuyOrUpgradePaywall, isTrialOrGracePeriod, accountSubscriptionCode, planType, } = showPaywallInfo;
    const showBuyDashlaneButton = shouldShowBuyOrUpgradePaywall && isTrialOrGracePeriod;
    const showSeePlansButton = shouldShowBuyOrUpgradePaywall && planType === 'starter';
    const buyDashlaneLink = `${BUSINESS_BUY}?plan=${planType === SpaceTier.Team ? 'team' : 'business'}&subCode=${accountSubscriptionCode}&utm_source=${POLICIES_PAGE_BUY_DASHLANE_UTM_SOURCE}`;
    let badgeLabel;
    let ctaAction;
    let ctaLabel;
    if (showBuyDashlaneButton) {
        badgeLabel = translate(I18N_KEYS.TEAM_SETTINGS_AVAILABLE_IN_PAID_SUBSCRIPTION);
        ctaAction = () => {
            logEvent(new UserClickEvent({
                button: Button.BuyDashlane,
                clickOrigin: ClickOrigin.VpnFeatureActivationSetting,
            }));
            openUrl(buyDashlaneLink);
        };
        ctaLabel = translate(I18N_KEYS.BUY_DASHLANE_CTA);
    }
    else if (showSeePlansButton) {
        badgeLabel = translate(I18N_KEYS.TEAM_SETTINGS_UPGRADE);
        ctaAction = () => {
            logEvent(new UserClickEvent({
                button: Button.SeePlan,
                clickOrigin: ClickOrigin.VpnFeatureActivationSetting,
            }));
            redirect(`${routes.teamAccountChangePlanRoutePath}`);
        };
        ctaLabel = translate(I18N_KEYS.SEE_PLANS_CTA);
    }
    return {
        type: showSeePlansButton || showBuyDashlaneButton ? 'cta' : 'switch',
        badgeIconName: showSeePlansButton || showBuyDashlaneButton
            ? 'PremiumOutlined'
            : undefined,
        badgeLabel,
        ctaAction,
        ctaLabel,
        label: translate(I18N_KEYS.TEAM_SETTINGS_VPN),
        helperLabel: translate(I18N_KEYS.TEAM_SETTINGS_VPN_HELPER),
        value: policies.enableVPN,
        feature: 'enableVPN',
        getErrorMessageForKey: (key: string) => {
            switch (key) {
                case 'too_many_requests':
                    return translate(I18N_KEYS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
                case 'not_authorized':
                    return translate(I18N_KEYS.TEAM_SETTINGS_VPN_DISABLED_FREE_TRIAL);
                default:
                    return translate(I18N_KEYS.TEAM_SETTINGS_VPN_DISABLED_GENERIC_ERROR);
            }
        },
    };
};
