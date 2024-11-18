import { AutoRenewInfo } from "@dashlane/communication";
export type PricingMode = "yearly" | "monthly";
export const getPlanRenewalPeriodicity = (
  autoRenewalInfo?: AutoRenewInfo
): PricingMode => {
  if (
    !autoRenewalInfo?.periodicity ||
    autoRenewalInfo.periodicity === "other"
  ) {
    return "monthly";
  } else {
    return autoRenewalInfo.periodicity;
  }
};
