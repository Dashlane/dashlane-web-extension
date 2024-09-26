import type {
  UserGroupDownload,
  ItemGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { SpaceStatus } from "../../../OpenSession";
export type { UserGroupDownload };
export type MemberPermission = "admin" | "limited";
export type MemberStatus =
  | SpaceStatus.Pending
  | SpaceStatus.Accepted
  | SpaceStatus.Refused
  | SpaceStatus.Revoked;
export interface UserGroup {
  Id?: string;
  Name?: string;
  Revision?: number;
  Members: Member[];
}
export interface Member {
  Alias: string;
  Login?: string;
  Permission: MemberPermission;
  Status?: MemberStatus;
}
export interface UserGroupRequest {}
export interface UserGroupError {
  message: string;
  action?: UserGroupRequest;
}
export interface UserGroupResult {
  userGroups: UserGroupDownload[];
  error?: CreateUserGroupError;
  itemGroups?: ItemGroupDownload[];
}
export interface CreateUserGroupRequest extends UserGroupRequest {
  teamId: number;
  name: string;
  externalId?: string;
}
export interface CreateUserGroupError extends UserGroupError {}
export interface CreateUserGroupResult extends UserGroupResult {}
export interface DeleteUserGroupRequest extends UserGroupRequest {
  groupId: string;
  revision: number;
}
export interface DeleteUserGroupError extends UserGroupError {}
export interface DeleteUserGroupResult extends UserGroupResult {}
export interface RenameUserGroupRequest extends UserGroupRequest {
  groupId: string;
  revision: number;
  name: string;
}
export interface RenameUserGroupError extends UserGroupError {}
export interface RenameUserGroupResult extends UserGroupResult {}
export interface UserInvite {
  alias: string;
  permission: MemberPermission;
}
export interface InviteUserGroupMembersRequest extends UserGroupRequest {
  groupId: string;
  revision: number;
  users: UserInvite[];
  teamId: number;
}
export interface InviteMembersError extends UserGroupError {}
export interface InviteUserGroupMembersResult extends UserGroupResult {
  refusedMembers: {
    [login: string]: string;
  };
}
export interface RevokeUserGroupMembersRequest extends UserGroupRequest {
  groupId: string;
  revision: number;
  users: string[];
}
export interface RevokeMembersError extends UserGroupError {}
export interface RevokeUserGroupMembersResult extends UserGroupResult {}
export interface UpdateUserGroupMembersRequest extends UserGroupRequest {
  groupId: string;
  revision: number;
  users: UserInvite[];
}
export interface UpdateMembersError extends UserGroupError {}
export interface UpdateUserGroupMembersResult extends UserGroupResult {}
