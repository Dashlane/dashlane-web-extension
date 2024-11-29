import { PremiumStatus } from "@dashlane/communication";
import { isAccountBusiness } from "../account/helpers";
export const getAdminRights = (premiumStatus: PremiumStatus) => {
  if (!isAccountBusiness(premiumStatus)) {
    return null;
  }
  const isTeamAdmin =
    premiumStatus.spaces?.some((space) => space.isTeamAdmin) ?? false;
  if (isTeamAdmin) {
    return "full";
  }
  const isBillingAdmin =
    premiumStatus.spaces?.some((space) => space.isBillingAdmin) ?? false;
  if (isBillingAdmin) {
    return "billing";
  }
  return null;
};
