import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { Policies } from "@dashlane/team-admin-contracts";
import {
  isBusinessTier,
  isStarterTier,
} from "../../../../libs/account/helpers";
import { usePremiumStatus } from "../../../../libs/carbon/hooks/usePremiumStatus";
import { getAdminRights } from "../../../../libs/console";
import { useTeamTrialStatus } from "../../../../libs/hooks/use-team-trial-status";
const REPACKAGE_GENERAL_FF = "monetization_extension_policies_repackage";
export const useAdvancedPoliciesPermission = () => {
  const premiumStatus = usePremiumStatus();
  const hasGeneralFeatureFlip = useFeatureFlip(REPACKAGE_GENERAL_FF);
  const teamTrialStatus = useTeamTrialStatus();
  if (premiumStatus.status !== DataStatus.Success || !hasGeneralFeatureFlip) {
    return {
      hasStarterPaywall: false,
      hasTrialBusinessPaywall: false,
      hasExcludedPolicy: () => false,
    };
  }
  const excludedPolicies: (keyof Policies)[] =
    premiumStatus.data.capabilities?.adminPolicies?.info.excludedPolicies || [];
  const isAdmin = getAdminRights(premiumStatus.data) === "full";
  const isStarterTeam = isStarterTier(premiumStatus.data);
  const isBusinessTeam = isBusinessTier(premiumStatus.data);
  const hasStarterPaywall = isStarterTeam && isAdmin;
  const hasTrialBusinessPaywall =
    isBusinessTeam && isAdmin && !!teamTrialStatus?.isFreeTrial;
  return {
    hasStarterPaywall,
    hasTrialBusinessPaywall,
    hasExcludedPolicy: (policy: keyof Policies) => {
      return excludedPolicies.includes(policy);
    },
  };
};
