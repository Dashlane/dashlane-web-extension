import { useVpnPageAccess } from ".";
const I18N_KEYS = {
  VPN_DISABLED_FOR_B2B_TITLE: "webapp_vpn_notification_disabled_for_b2b_title",
  VPN_DISABLED_FOR_B2B_DESC:
    "webapp_vpn_notification_disabled_for_b2b_description",
};
export const useVpnMenuItem = (
  isCollapsed: boolean,
  notificationClass: string
) => {
  const vpnPageAccess = useVpnPageAccess();
  if (
    vpnPageAccess?.showVpnPage === undefined ||
    vpnPageAccess?.showVpnMenuItem === undefined ||
    vpnPageAccess?.showVpnDisabledB2BTooltip === undefined ||
    vpnPageAccess?.vpnPaywallInfo === undefined
  ) {
    return null;
  }
  const {
    showVpnPage,
    showVpnMenuItem,
    vpnPaywallInfo,
    showVpnDisabledB2BTooltip,
  } = vpnPageAccess;
  const getVpnDisabledNotification = () => {
    const title = I18N_KEYS.VPN_DISABLED_FOR_B2B_TITLE;
    const description = I18N_KEYS.VPN_DISABLED_FOR_B2B_DESC;
    return {
      showNotification: !isCollapsed && showVpnDisabledB2BTooltip,
      notificationClass,
      title,
      description,
    };
  };
  return {
    showVpnPage,
    showVpnMenuItem,
    vpnPaywallInfo,
    getVpnDisabledNotification,
  };
};
