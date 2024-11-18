import { useNodePremiumStatus } from "../api";
const FREE_TRIAL_PLAN_NAME = "free_trial_30d";
export function useIsPostB2CTrial(): boolean | null {
  const premiumStatus = useNodePremiumStatus();
  if (!premiumStatus) {
    return null;
  }
  return (
    !premiumStatus.isTrial &&
    premiumStatus.statusCode === 0 &&
    premiumStatus.previousPlan?.planName === FREE_TRIAL_PLAN_NAME &&
    Object.keys(premiumStatus.b2bStatus?.currentTeam ?? {}).length === 0
  );
}
