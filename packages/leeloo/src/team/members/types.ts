import { TeamMemberInfo } from "@dashlane/communication";
export type MemberAction =
  | "reassign"
  | "reactivate"
  | "reinvite"
  | "revoke"
  | "reinviteAll"
  | "generateBackupCode"
  | "shareInviteLink"
  | "changeLoginEmail"
  | "cancelChangeLoginEmail"
  | "enableInviteLink";
export interface MemberData extends TeamMemberInfo {
  filterableStatus?: "accepted" | "pending" | "removed";
  changeLoginEmailPending?: boolean;
  sortableLastActivity?: number;
  sortablePasswords?: number;
  sortableRights?: number;
  sortableSecurityScore?: number;
  sortableSafePasswords?: number;
  sortableWeakPasswords?: number;
  sortableReused?: number;
  sortableCompromisedPasswords?: number;
}
export type MemberStatusFilter = "accepted" | "pending" | "removed";
export type SortableMemberProps =
  | "login"
  | "sortableLastActivity"
  | "sortablePasswords"
  | "sortableSafePasswords"
  | "sortableWeakPasswords"
  | "sortableReused"
  | "sortableCompromisedPasswords"
  | "sortableRights"
  | "sortableSecurityScore";
