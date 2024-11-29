import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export type UseGetTeamCreationDate =
  | {
      status: DataStatus.Error;
    }
  | {
      status: DataStatus.Loading;
    }
  | {
      status: DataStatus.Success;
      teamCreationDate: number;
    };
export const useTeamCreationDate = (): UseGetTeamCreationDate => {
  const { data, status } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamCreationDateUnix"
  );
  if (status !== DataStatus.Success) {
    return { status };
  }
  if (data === null) {
    return { status: DataStatus.Loading };
  }
  return { status, teamCreationDate: data };
};
