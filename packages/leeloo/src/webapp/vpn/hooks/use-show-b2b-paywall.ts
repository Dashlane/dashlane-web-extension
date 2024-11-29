import { DataStatus } from "@dashlane/framework-react";
import {
  isAccountBusinessAdmin,
  isAccountTeamTrialBusiness,
  isStarterTier,
} from "../../../libs/account/helpers";
import { usePremiumStatus } from "../../../libs/carbon/hooks/usePremiumStatus";
export function useShowB2BPaywall(): boolean | null {
  const premiumStatus = usePremiumStatus();
  if (premiumStatus.status !== DataStatus.Success || !premiumStatus.data) {
    return null;
  }
  const isB2BAdminInTrial =
    isAccountTeamTrialBusiness(premiumStatus.data) &&
    isAccountBusinessAdmin(premiumStatus.data);
  const isStarterPlanAdmin =
    isStarterTier(premiumStatus.data) &&
    isAccountBusinessAdmin(premiumStatus.data);
  return isB2BAdminInTrial || isStarterPlanAdmin;
}
