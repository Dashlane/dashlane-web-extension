import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useIsTeamCreator } from "../../team/hooks/use-is-team-creator";
import { useNodePremiumStatus } from "../carbon/hooks/useNodePremiumStatus";
type IsB2B = {
  isB2B: true;
  b2bRoles: {
    isAdmin: boolean;
    isTeamCreator: boolean;
  };
};
type IsB2C = {
  isB2B: false;
};
type UseIsUserB2B =
  | ({
      status: DataStatus.Success;
    } & (IsB2C | IsB2B))
  | {
      status: DataStatus.Error | DataStatus.Loading;
    };
export const useIsUserB2B = (): UseIsUserB2B => {
  const nodePremiumStatusResponse = useNodePremiumStatus();
  const isTeamCreatorResponse = useIsTeamCreator();
  if (
    nodePremiumStatusResponse.status === DataStatus.Error ||
    isTeamCreatorResponse.status === DataStatus.Error
  ) {
    return { status: DataStatus.Error };
  }
  if (
    nodePremiumStatusResponse.status === DataStatus.Loading ||
    isTeamCreatorResponse.status === DataStatus.Loading
  ) {
    return { status: DataStatus.Loading };
  }
  const isB2B = !!nodePremiumStatusResponse.data?.b2bStatus?.currentTeam;
  if (!isB2B) {
    return {
      status: DataStatus.Success,
      isB2B: false,
    };
  }
  const isTeamCreator = isTeamCreatorResponse.isTeamCreator;
  const isAdmin =
    nodePremiumStatusResponse.data.b2bStatus?.currentTeam?.teamMembership
      .isTeamAdmin ?? false;
  return {
    status: DataStatus.Success,
    isB2B: true,
    b2bRoles: {
      isAdmin,
      isTeamCreator,
    },
  };
};
