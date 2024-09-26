import { MemberPermission } from "../../../";
export interface UserRecipient {
  type: "user";
  alias: string;
}
export interface GroupRecipient {
  type: "userGroup";
  groupId: string;
  name?: string;
}
export type Recipient = UserRecipient | GroupRecipient;
export function isUserRecipient(u: Recipient): u is UserRecipient {
  return Boolean(u) && u.type === "user";
}
export function isGroupRecipient(u: Recipient): u is GroupRecipient {
  return Boolean(u) && u.type === "userGroup";
}
export interface ShareItemRequest {
  itemId: string;
  permission: MemberPermission;
  recipients: Recipient[];
}
export enum ShareItemFailureReason {
  ITEM_DOESNT_EXIST,
  LIMIT_EXCEEDED,
  ITEM_HAS_ATTACHMENTS,
  SHARING_FAILED,
}
export type ShareItemResponse = {
  success: boolean;
  reason?: ShareItemFailureReason;
  message?: string;
};
