import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
export const useIsStandard = () => {
  const teamTrialStatus = useTeamTrialStatus();
  return teamTrialStatus?.spaceTier === SpaceTier.Standard;
};
