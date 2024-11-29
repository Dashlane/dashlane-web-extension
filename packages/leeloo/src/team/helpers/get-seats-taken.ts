import { TeamMemberInfo } from "@dashlane/communication";
export const getSeatsTaken = (members: TeamMemberInfo[]): number => {
  return members.filter(({ status }) => status !== "removed").length;
};
