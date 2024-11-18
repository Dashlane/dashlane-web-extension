import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useNodePremiumStatus } from "./use-node-premium-status";
export type UseIsPersonalSpaceDisabled =
  | {
      status: DataStatus.Loading | DataStatus.Error;
    }
  | {
      status: DataStatus.Success;
      isDisabled: boolean;
    };
export const useIsPersonalSpaceDisabled = (): UseIsPersonalSpaceDisabled => {
  const premiumData = useNodePremiumStatus();
  if (premiumData.status !== DataStatus.Success) {
    return {
      status: premiumData.status,
    };
  }
  const isPersonalSpaceDisabledViaTeamSetting =
    !!premiumData.data.b2bStatus &&
    premiumData.data.b2bStatus.statusCode === "in_team" &&
    !premiumData.data.b2bStatus.currentTeam?.teamInfo.personalSpaceEnabled;
  return {
    status: DataStatus.Success,
    isDisabled: isPersonalSpaceDisabledViaTeamSetting,
  };
};
