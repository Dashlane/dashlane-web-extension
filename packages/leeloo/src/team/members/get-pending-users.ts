import { TeamMemberInfo } from "@dashlane/communication";
export const getPendingUsers = (members: TeamMemberInfo[]): TeamMemberInfo[] =>
  members.filter((member: TeamMemberInfo) =>
    ["pending", "proposed"].includes(member.status)
  );
