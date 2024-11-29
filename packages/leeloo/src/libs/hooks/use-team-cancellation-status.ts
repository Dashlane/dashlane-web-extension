import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  CancellationStatus,
  teamPlanDetailsApi,
} from "@dashlane/team-admin-contracts";
export type UseTeamCancellationStatusOutput = {
  isLoading: boolean;
  status: CancellationStatus;
};
export const useTeamCancellationStatus =
  (): UseTeamCancellationStatusOutput => {
    const teamCancellationStatus = useModuleQuery(
      teamPlanDetailsApi,
      "getTeamCancellationStatus"
    );
    if (teamCancellationStatus.status === DataStatus.Loading) {
      return {
        isLoading: true,
        status: CancellationStatus.None,
      };
    }
    if (teamCancellationStatus.status === DataStatus.Error) {
      return { isLoading: false, status: CancellationStatus.Unknown };
    }
    return {
      isLoading: false,
      status: teamCancellationStatus.data,
    };
  };
