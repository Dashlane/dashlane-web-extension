import {
  DataStatus,
  useModuleCommands,
  useModuleQuery,
} from "@dashlane/framework-react";
import { Result } from "@dashlane/framework-types";
import {
  Policies,
  teamPlanDetailsApi,
  TeamPolicyUpdates,
} from "@dashlane/team-admin-contracts";
type UseTeamAdminResponse = {
  status: DataStatus.Success | DataStatus.Error | DataStatus.Loading;
  data?: {
    teamPolicies: Policies;
  };
  editTeamPolicies?: (updates: TeamPolicyUpdates) => Promise<Result<undefined>>;
};
export const useTeamAdmin = (): UseTeamAdminResponse => {
  const { data: teamIdData, status: teamIdStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamId"
  );
  const { data: teamPoliciesData, status: teamPoliciesStatus } = useModuleQuery(
    teamPlanDetailsApi,
    "getTeamPolicies"
  );
  const { editTeamPolicies } = useModuleCommands(teamPlanDetailsApi);
  if (
    teamPoliciesStatus === DataStatus.Error ||
    teamIdStatus === DataStatus.Error
  ) {
    return {
      status: DataStatus.Error,
    };
  }
  if (
    teamPoliciesStatus === DataStatus.Loading ||
    teamIdStatus === DataStatus.Loading
  ) {
    return { status: DataStatus.Loading };
  }
  return {
    status: DataStatus.Success,
    data: { teamPolicies: teamPoliciesData },
    editTeamPolicies: (updates: TeamPolicyUpdates) =>
      editTeamPolicies({
        teamId: Number(teamIdData.teamId),
        policyUpdates: updates,
      }),
  };
};
