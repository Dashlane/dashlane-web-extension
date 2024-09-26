import {
  FamilyMember,
  FamilyMemberRole,
  FamilyMemberRoles,
} from "@dashlane/communication";
export function getAdmin(members: FamilyMember[]): FamilyMember {
  return members.find((member) => member.role === FamilyMemberRoles.ADMIN);
}
export function getMembersByRole(
  members: FamilyMember[],
  role: FamilyMemberRole
): FamilyMember[] {
  return members.filter((member) => member.role === role);
}
export function getMembersCount(members: FamilyMember[]): number {
  const adminsCount = getMembersByRole(members, FamilyMemberRoles.ADMIN).length;
  const regularsCount = getMembersByRole(
    members,
    FamilyMemberRoles.REGULAR
  ).length;
  return adminsCount + regularsCount;
}
export function getSpots(members: FamilyMember[], maxMembers: number): number {
  const membersCount = getMembersCount(members);
  return maxMembers - membersCount;
}
