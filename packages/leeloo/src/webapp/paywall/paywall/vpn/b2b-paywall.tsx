import { useEffect } from "react";
import { PremiumStatus } from "@dashlane/communication";
import { Badge, ExpressiveIcon } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { isStarterTier } from "../../../../libs/account/helpers";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { PAYWALL_SUBTYPE } from "../../logs";
import { GenericPaywall } from "../generic-paywall";
import { PaywallActionButtons } from "./paywall-actions";
const I18N_KEYS = {
  UPGRADE_BADGE: "webapp_vpn_paywall_upgrade_badge",
  AVAILABLE_IN_PAID_BADGE: "webapp_vpn_paywall_available_in_paid_badge",
  VPN_PAYWALL_UPGRADE_TITLE: "webapp_vpn_paywall_title",
  VPN_PAYWALL_UPGRADE_SUBTITLE: "webapp_vpn_paywall_subtitle",
  HOTSPOT_ITEM_TITLE: "webapp_vpn_paywall_hotspot_item_title",
  HOTSPOT_ITEM_SUBTITLE: "webapp_vpn_paywall_hotspot_item_subtitle",
  STAY_ANONYMOUS_ITEM_TITLE: "webapp_vpn_paywall_stay_anonymous_item_title",
  STAY_ANONYMOUS_ITEM_SUBTITLE:
    "webapp_vpn_paywall_stay_anonymous_item_subtitle",
  ACCESS_ITEM_TITLE: "webapp_vpn_paywall_access_item_title",
  ACCESS_ITEM_SUBTITLE: "webapp_vpn_paywall_access_item_subtitle",
};
type Props = {
  mode: "fullscreen" | "popup";
  premiumStatus: PremiumStatus;
};
const paywallFeatures = [
  {
    icon: (
      <ExpressiveIcon name="FeatureVpnOutlined" mood="brand" size="medium" />
    ),
    key: I18N_KEYS.HOTSPOT_ITEM_TITLE,
    title: I18N_KEYS.HOTSPOT_ITEM_TITLE,
    description: I18N_KEYS.HOTSPOT_ITEM_SUBTITLE,
  },
  {
    icon: (
      <ExpressiveIcon
        name="HealthPositiveOutlined"
        mood="brand"
        size="medium"
      />
    ),
    key: I18N_KEYS.STAY_ANONYMOUS_ITEM_TITLE,
    title: I18N_KEYS.STAY_ANONYMOUS_ITEM_TITLE,
    description: I18N_KEYS.STAY_ANONYMOUS_ITEM_SUBTITLE,
  },
  {
    icon: <ExpressiveIcon name="WebOutlined" mood="brand" size="medium" />,
    key: I18N_KEYS.ACCESS_ITEM_TITLE,
    title: I18N_KEYS.ACCESS_ITEM_TITLE,
    description: I18N_KEYS.ACCESS_ITEM_SUBTITLE,
  },
];
export const B2BPaywall = ({ premiumStatus, mode }: Props) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logPageView(PageView.PaywallVpn);
  });
  return (
    <GenericPaywall
      title={I18N_KEYS.VPN_PAYWALL_UPGRADE_TITLE}
      description={I18N_KEYS.VPN_PAYWALL_UPGRADE_SUBTITLE}
      paywallFeatures={paywallFeatures}
      mode={mode}
      paywallType={PAYWALL_SUBTYPE.VPN}
      lightBackground
      headingBadge={
        <Badge
          mood="brand"
          intensity="quiet"
          label={translate(
            isStarterTier(premiumStatus)
              ? I18N_KEYS.UPGRADE_BADGE
              : I18N_KEYS.AVAILABLE_IN_PAID_BADGE
          )}
          layout="iconLeading"
          iconName={"PremiumOutlined"}
        />
      }
      customFooter={<PaywallActionButtons premiumStatus={premiumStatus} />}
    />
  );
};
