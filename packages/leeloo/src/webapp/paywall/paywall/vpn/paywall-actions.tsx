import { Button, jsx } from '@dashlane/design-system';
import { Button as HermesButton, UserClickEvent } from '@dashlane/hermes';
import { PremiumStatus } from '@dashlane/communication';
import { isBusinessTier, isStarterTier } from 'libs/account/helpers';
import { useAccountInfo } from 'libs/carbon/hooks/useAccountInfo';
import { LearnMoreDropdown } from 'libs/dropdown/learn-more-dropdown';
import { openUrl } from 'libs/external-urls';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { DASHLANE_ADMIN_HELP_CENTER, DASHLANE_ARTICLE_HOTSPOT_SHIELD_VPN, DASHLANE_ARTICLE_SET_UP_VPN, DASHLANE_ARTICLE_WHAT_IS_VPN, DASHLANE_B2B_DIRECT_BUY, } from 'webapp/urls';
const VPN_PAYWALL_UTM_SOURCE = 'button:buy_dashlane_tier+origin_page:paywall/vpn+origin_component:main_app';
const SX_STYLES = {
    ACTIONS: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'stretch',
    },
};
const LEARN_MORE_DROPDOWN_ITEMS = {
    WHATS_VPN: {
        i18nKey: 'webapp_vpn_paywall_whats_vpn',
        url: DASHLANE_ARTICLE_WHAT_IS_VPN,
    },
    WHY_VPN: {
        i18nKey: 'webapp_vpn_paywall_why_vpn',
        url: DASHLANE_ARTICLE_WHAT_IS_VPN,
    },
    SET_UP_VPN: {
        i18nKey: 'webapp_vpn_paywall_set_up',
        url: DASHLANE_ARTICLE_SET_UP_VPN,
    },
    HOTSPOT_VPN: {
        i18nKey: 'webapp_vpn_paywall_hotspot',
        url: DASHLANE_ARTICLE_HOTSPOT_SHIELD_VPN,
    },
    ADMIN_HELP_CENTER: {
        i18nKey: 'webapp_vpn_paywall_help_center',
        url: DASHLANE_ADMIN_HELP_CENTER,
    },
};
const I18N_KEYS = {
    BUY_DASHLANE_BUTTON: 'webapp_vpn_paywall_buy_dashlane_button',
    SEE_PLANS_BUTTON: 'webapp_vpn_paywall_see_plans_button',
    LEARN_MORE: 'webapp_vpn_paywall_learn_more',
};
type Props = {
    premiumStatus: PremiumStatus;
};
export const PaywallActionButtons = ({ premiumStatus }: Props) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const accountInfo = useAccountInfo();
    const isStarterPlan = isStarterTier(premiumStatus);
    const isBusiness = isBusinessTier(premiumStatus);
    const buyDashlaneLink = `${DASHLANE_B2B_DIRECT_BUY}?plan=${isBusiness ? 'business' : 'team'}&subCode=${accountInfo?.subscriptionCode ?? ''}&utm_source=${VPN_PAYWALL_UTM_SOURCE}`;
    const handleUpgrade = () => {
        if (isStarterPlan) {
            logEvent(new UserClickEvent({
                button: HermesButton.SeePlan,
            }));
            redirect(`${routes.teamAccountChangePlanRoutePath}`);
        }
        else {
            logEvent(new UserClickEvent({
                button: HermesButton.BuyDashlane,
            }));
            openUrl(buyDashlaneLink);
        }
    };
    return (<div sx={SX_STYLES.ACTIONS}>
      <LearnMoreDropdown dropdownItems={LEARN_MORE_DROPDOWN_ITEMS} titleKey={I18N_KEYS.LEARN_MORE}/>
      <Button mood="brand" intensity="catchy" role={isStarterPlan ? 'link' : undefined} onClick={handleUpgrade}>
        {translate(isStarterPlan
            ? I18N_KEYS.SEE_PLANS_BUTTON
            : I18N_KEYS.BUY_DASHLANE_BUTTON)}
      </Button>
    </div>);
};
