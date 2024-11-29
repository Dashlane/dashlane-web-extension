import {
  VpnCapabilitySetting,
  VpnDisabledReason,
} from "@dashlane/communication";
import { useShowB2BPaywall, useVpnCapabilitySetting } from ".";
export enum VPNPaywallType {
  B2B = "b2b",
  B2C = "b2c",
}
export interface VpnPageAccess {
  readonly showVpnPage: boolean;
  readonly showVpnMenuItem: boolean;
  readonly vpnPageAccessLoading: boolean;
  readonly showVpnDisabledB2BTooltip: boolean;
  readonly vpnPaywallInfo: {
    isVisible: boolean;
    type: VPNPaywallType | null;
  };
}
const checkReason = (
  vpnCapabilitySetting: VpnCapabilitySetting | null,
  reason: VpnDisabledReason
) =>
  !!vpnCapabilitySetting &&
  !vpnCapabilitySetting.hasVpnEnabled &&
  vpnCapabilitySetting?.vpnDisabledReason === reason;
export const useVpnPageAccess = (): VpnPageAccess | null => {
  const vpnCapabilitySetting = useVpnCapabilitySetting();
  const showB2BPaywall = useShowB2BPaywall();
  if (showB2BPaywall === null) {
    return null;
  }
  const userHasVpnEnabled =
    !!vpnCapabilitySetting && vpnCapabilitySetting.hasVpnEnabled;
  const showVpnDisabledB2BTooltip = checkReason(
    vpnCapabilitySetting,
    VpnDisabledReason.InTeam
  );
  const showB2CPaywall =
    (checkReason(vpnCapabilitySetting, VpnDisabledReason.NotPremium) ||
      checkReason(vpnCapabilitySetting, VpnDisabledReason.NoPayment)) &&
    !showB2BPaywall;
  const showVpnPage = userHasVpnEnabled || showB2CPaywall || showB2BPaywall;
  const showVpnMenuItem = showVpnDisabledB2BTooltip || showVpnPage;
  const getPaywallType = () => {
    if (showB2BPaywall) {
      return VPNPaywallType.B2B;
    } else if (showB2CPaywall) {
      return VPNPaywallType.B2C;
    }
    return null;
  };
  return {
    showVpnPage,
    showVpnMenuItem,
    showVpnDisabledB2BTooltip,
    vpnPageAccessLoading: !vpnCapabilitySetting,
    vpnPaywallInfo: {
      isVisible: showB2BPaywall || showB2CPaywall,
      type: getPaywallType(),
    },
  };
};
