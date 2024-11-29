import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export type UseTeamId =
  | {
      status: DataStatus.Error;
    }
  | {
      status: DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      teamId: number | null;
    };
export const useTeamId = (): UseTeamId => {
  const { data, status } = useModuleQuery(teamPlanDetailsApi, "getTeamId");
  if (status !== DataStatus.Success) {
    return { status };
  }
  return {
    status,
    teamId: data.teamId === null ? null : Number(data.teamId),
  };
};
