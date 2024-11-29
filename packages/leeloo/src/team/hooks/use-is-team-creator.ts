import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export type UseIsTeamCreator =
  | {
      status: DataStatus.Error;
    }
  | {
      status: DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      isTeamCreator: boolean;
    };
export const useIsTeamCreator = (): UseIsTeamCreator => {
  const { data, status } = useModuleQuery(teamPlanDetailsApi, "isTeamCreator");
  if (status === DataStatus.Loading) {
    return { status };
  }
  if (status === DataStatus.Error) {
    return { status: DataStatus.Success, isTeamCreator: false };
  }
  if (data === null) {
    return { status: DataStatus.Loading };
  }
  return {
    status,
    isTeamCreator: data,
  };
};
