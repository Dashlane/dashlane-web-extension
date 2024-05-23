import { AlertSeverity, Button, colors, InfoBox, jsx, Paragraph, } from '@dashlane/ui-components';
import { useNotificationSeen } from 'libs/carbon/hooks/useNotificationStatus';
import { NotificationName, PremiumStatus } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { isAccountBusiness } from 'libs/account/helpers';
import { HOTSPOT_SHIELD_URL, OPEN_IN_NEW_TAB } from './vpn-links-constants';
const I18N_KEYS = {
    VPN_PAGE_INFOBOX_TITLE: 'webapp_vpn_page_infobox_title_markup',
    VPN_PAGE_INFOBOX_MESSAGE: 'webapp_vpn_page_infobox_message_markup',
    VPN_PAGE_INFOBOX_BUTTON: 'webapp_vpn_page_infobox_button',
    VPN_PAGE_INFOBOX_PREMIUM: 'webapp_vpn_page_infobox_premium',
    VPN_PAGE_INFOBOX_BUSINESS: 'webapp_vpn_page_infobox_business',
};
interface VpnInfoBoxProps {
    premiumStatus: PremiumStatus;
}
export const VpnInfoBox = ({ premiumStatus }: VpnInfoBoxProps) => {
    const { unseen, setAsSeen } = useNotificationSeen(NotificationName.VpnProviderIsNowHotspot);
    const { translate } = useTranslate();
    if (!unseen) {
        return null;
    }
    const closeButton = (<Button nature="secondary" onClick={setAsSeen} key="secondaryAction" size="small" type="button">
      {translate(I18N_KEYS.VPN_PAGE_INFOBOX_BUTTON)}
    </Button>);
    return (<InfoBox sx={{
            'a:hover:not(:disabled)': {
                color: colors.white,
            },
            'a:not(:disabled)': {
                color: colors.dashGreen03,
            },
            marginBottom: '32px',
        }} severity={AlertSeverity.STRONG} title={translate.markup(I18N_KEYS.VPN_PAGE_INFOBOX_TITLE)} actions={[closeButton]} iconSizePx={16} size="descriptive" layout="inline">
      <Paragraph size="small" sx={{ color: colors.dashGreen05 }}>
        {translate.markup(I18N_KEYS.VPN_PAGE_INFOBOX_MESSAGE, {
            hotspotShield: HOTSPOT_SHIELD_URL,
            plan: translate(premiumStatus && isAccountBusiness(premiumStatus)
                ? I18N_KEYS.VPN_PAGE_INFOBOX_BUSINESS
                : I18N_KEYS.VPN_PAGE_INFOBOX_PREMIUM),
        }, { linkTarget: OPEN_IN_NEW_TAB })}
      </Paragraph>
    </InfoBox>);
};
