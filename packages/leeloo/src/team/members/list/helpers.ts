import { TeamMemberInfo } from "@dashlane/communication";
import { MemberData } from "../types";
enum RIGHTS_SORT_ORDER {
  TEAM_CAPTAIN = 0,
  GROUP_MANAGER = 1,
  BILLING_ADMIN = 2,
  ACCEPTED = 3,
  PENDING_PROPOSED = 4,
  DEFAULT = 5,
}
const getSortableRights = ({
  isTeamCaptain,
  isBillingAdmin,
  isGroupManager,
  status,
}: MemberData): RIGHTS_SORT_ORDER => {
  switch (true) {
    case isTeamCaptain:
      return RIGHTS_SORT_ORDER.TEAM_CAPTAIN;
    case isGroupManager:
      return RIGHTS_SORT_ORDER.GROUP_MANAGER;
    case isBillingAdmin:
      return RIGHTS_SORT_ORDER.BILLING_ADMIN;
    case status === "accepted":
      return RIGHTS_SORT_ORDER.ACCEPTED;
    case ["pending", "proposed"].includes(status):
      return RIGHTS_SORT_ORDER.PENDING_PROPOSED;
    default:
      return RIGHTS_SORT_ORDER.DEFAULT;
  }
};
const getSortablePassword = (value?: number | null, status?: string) => {
  if (typeof value === "number") {
    return value;
  }
  return status &&
    ["pending", "proposed", "removed", "revoked"].includes(status)
    ? -1
    : 0;
};
function mapMemberStatusToFilterable(memberStatus: TeamMemberInfo["status"]) {
  if (memberStatus === "proposed") {
    return "pending" as const;
  }
  if (memberStatus === "revoked") {
    return "removed" as const;
  }
  if (memberStatus === "unproposed") {
    return undefined;
  }
  return memberStatus as MemberData["filterableStatus"];
}
export const mapMember = (members: TeamMemberInfo[]): MemberData[] =>
  members.map((member) => ({
    ...member,
    filterableStatus: mapMemberStatusToFilterable(member.status),
    sortableLastActivity:
      member.revokedDateUnix || member.lastUpdateDateUnix || 0,
    sortablePasswords: getSortablePassword(member.nbrPasswords, member.status),
    sortableRights: getSortableRights(member),
    sortableSecurityScore: getSortablePassword(
      member.securityIndex,
      member.status
    ),
    sortableSafePasswords: getSortablePassword(
      member.safePasswords,
      member.status
    ),
    sortableWeakPasswords: getSortablePassword(
      member.weakPasswords,
      member.status
    ),
    sortableReused: getSortablePassword(member.reused, member.status),
    sortableCompromisedPasswords: getSortablePassword(
      member.compromisedPasswords,
      member.status
    ),
  }));
