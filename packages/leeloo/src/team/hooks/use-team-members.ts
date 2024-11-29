import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useModuleQuery } from "@dashlane/framework-react";
import {
  GetMembersQueryResult,
  teamMembersApi,
} from "@dashlane/team-admin-contracts";
export type UseTeamMembersOutput = {
  isLoading: boolean;
  isErrored: boolean;
  data: GetMembersQueryResult | null;
};
export const useTeamMembersNG = (
  teamId: number | null
): UseTeamMembersOutput => {
  const { data, status } = useModuleQuery(teamMembersApi, "getMembersList", {
    teamId: teamId?.toString() ?? "",
  });
  const defaultOutput = {
    isLoading: false,
    isErrored: false,
    data: null,
  };
  if (status === DataStatus.Loading) {
    return { ...defaultOutput, isLoading: true };
  }
  if (status === DataStatus.Error) {
    return { ...defaultOutput, isErrored: true };
  }
  return {
    isLoading: false,
    isErrored: false,
    data,
  };
};
