import { useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import { PremiumStatus } from "@dashlane/communication";
import { logPageView } from "../../../../libs/logs/logEvent";
import { B2CPaywall } from "./b2c-paywall";
import { B2BPaywall } from "./b2b-paywall";
import { PaywallProps } from "../generic-paywall";
export type VpnPaywallProps = Pick<PaywallProps, "mode" | "closePaywall"> & {
  premiumStatus: PremiumStatus;
  isB2CPaywall: boolean;
};
export const VpnPaywall = ({
  mode,
  closePaywall,
  premiumStatus,
  isB2CPaywall,
}: VpnPaywallProps) => {
  useEffect(() => {
    logPageView(PageView.PaywallVpn);
  }, []);
  return isB2CPaywall ? (
    <B2CPaywall
      mode={mode}
      closePaywall={closePaywall}
      premiumStatus={premiumStatus}
    />
  ) : (
    <B2BPaywall mode={mode} premiumStatus={premiumStatus} />
  );
};
