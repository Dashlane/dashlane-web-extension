import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { teamMembersApi } from "@dashlane/team-admin-contracts";
type UseHasTeamMembers =
  | {
      status: DataStatus.Loading | DataStatus.Error;
    }
  | {
      status: DataStatus.Success;
      hasTeamMembers: boolean;
      hasInvitations: boolean;
    };
export const useHasTeamMembers = ({
  teamId,
}: {
  teamId: number;
}): UseHasTeamMembers => {
  const getMembersList = useModuleQuery(teamMembersApi, "getMembersList", {
    teamId: teamId?.toString() ?? "",
  });
  if (getMembersList.status !== DataStatus.Success) {
    return { status: getMembersList.status };
  }
  const acceptedTeamMembers = (getMembersList.data?.members ?? []).filter(
    (member) => member.status === "accepted"
  );
  const pendingTeamMembers = (getMembersList.data?.members ?? []).filter(
    (member) => ["pending", "proposed"].includes(member.status)
  );
  return {
    status: DataStatus.Success,
    hasTeamMembers: acceptedTeamMembers.length > 1,
    hasInvitations: pendingTeamMembers.length > 0,
  };
};
