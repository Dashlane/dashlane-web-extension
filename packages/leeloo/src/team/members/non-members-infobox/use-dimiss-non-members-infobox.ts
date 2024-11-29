import { useModuleCommands } from "@dashlane/framework-react";
import { teamMembersApi } from "@dashlane/team-admin-contracts";
export function useDismissNonMembersInfobox() {
  const { dismissNonMembersInfobox } = useModuleCommands(teamMembersApi);
  return dismissNonMembersInfobox;
}
