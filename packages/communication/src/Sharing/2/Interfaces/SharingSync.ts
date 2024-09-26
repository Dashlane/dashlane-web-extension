import { Credential, MemberPermission, Note, Secret } from "../../../";
export type SharedItemContent = Credential | Note | Secret;
export interface PendingItemGroup {
  items: SharedItemContent[];
  itemGroupId: string;
  referrer: string;
  permission: MemberPermission;
}
export interface PendingUserGroup {
  groupId: string;
  name: string;
  referrer: string;
  permission: MemberPermission;
}
export interface PendingSharingItems {
  pendingItemGroups: PendingItemGroup[];
  pendingUserGroups: PendingUserGroup[];
}
export interface SharingSyncUpdatedEvent {
  pendingItemGroups: PendingItemGroup[];
  pendingUserGroups: PendingUserGroup[];
}
