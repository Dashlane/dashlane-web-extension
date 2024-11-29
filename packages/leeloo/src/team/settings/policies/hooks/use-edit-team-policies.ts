import { useModuleCommands } from "@dashlane/framework-react";
import { teamPlanDetailsApi } from "@dashlane/team-admin-contracts";
export const useEditTeamPolicies = () => {
  const { editTeamPolicies } = useModuleCommands(teamPlanDetailsApi);
  return editTeamPolicies;
};
