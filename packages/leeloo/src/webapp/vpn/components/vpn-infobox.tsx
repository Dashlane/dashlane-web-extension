import { Button, Infobox } from "@dashlane/design-system";
import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { vpnNotificationsApi } from "@dashlane/vpn-contracts";
import { PremiumStatus } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { isAccountBusiness } from "../../../libs/account/helpers";
import { HOTSPOT_SHIELD_URL } from "../helpers/links";
import { OPEN_IN_NEW_TAB } from "../helpers/constants";
const I18N_KEYS = {
  VPN_PAGE_INFOBOX_TITLE: "webapp_vpn_page_infobox_title_markup",
  VPN_PAGE_INFOBOX_MESSAGE: "webapp_vpn_page_infobox_message_markup",
  VPN_PAGE_INFOBOX_BUTTON: "webapp_vpn_page_infobox_button",
  VPN_PAGE_INFOBOX_PREMIUM: "webapp_vpn_page_infobox_premium",
  VPN_PAGE_INFOBOX_BUSINESS: "webapp_vpn_page_infobox_business",
};
interface VpnInfoBoxProps {
  premiumStatus: PremiumStatus;
}
export const VpnInfoBox = ({ premiumStatus }: VpnInfoBoxProps) => {
  const { translate } = useTranslate();
  const hasSeenNotification = useModuleQuery(
    vpnNotificationsApi,
    "hasSeenVpnProvider"
  );
  const { markVpnProviderSeen } = useModuleCommands(vpnNotificationsApi);
  if (
    (hasSeenNotification.status === DataStatus.Success &&
      hasSeenNotification.data) ||
    hasSeenNotification.status === DataStatus.Loading ||
    hasSeenNotification.status === DataStatus.Error
  ) {
    return null;
  }
  return (
    <Infobox
      sx={{
        marginBottom: "32px",
      }}
      mood="brand"
      size="large"
      title={translate.markup(I18N_KEYS.VPN_PAGE_INFOBOX_TITLE)}
      description={translate.markup(
        I18N_KEYS.VPN_PAGE_INFOBOX_MESSAGE,
        {
          hotspotShield: HOTSPOT_SHIELD_URL,
          plan: translate(
            premiumStatus && isAccountBusiness(premiumStatus)
              ? I18N_KEYS.VPN_PAGE_INFOBOX_BUSINESS
              : I18N_KEYS.VPN_PAGE_INFOBOX_PREMIUM
          ),
        },
        { linkTarget: OPEN_IN_NEW_TAB }
      )}
      actions={[
        <Button
          onClick={() => markVpnProviderSeen()}
          key={translate(I18N_KEYS.VPN_PAGE_INFOBOX_BUTTON)}
        >
          {translate(I18N_KEYS.VPN_PAGE_INFOBOX_BUTTON)}
        </Button>,
      ]}
    />
  );
};
