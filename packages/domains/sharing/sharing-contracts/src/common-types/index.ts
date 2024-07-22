import { z } from "zod";
import { ValuesType } from "@dashlane/framework-types";
export enum Permission {
  Admin = "admin",
  Limited = "limited",
}
export enum Status {
  Pending = "pending",
  Accepted = "accepted",
  Refused = "refused",
  Revoked = "revoked",
}
export const StatusSchema = z.nativeEnum(Status);
export const PermissionSchema = z.nativeEnum(Permission);
export const RsaStatusSchema = z.union([
  z.literal("noKey"),
  z.literal("publicKey"),
  z.literal("sharingKeys"),
]);
export enum SharedItemAccessLinkTypes {
  User = "user",
  UserGroup = "group",
  CollectionUser = "collectionUser",
  CollectionUserGroup = "collectionUserGroup",
}
export enum ShareableItemType {
  Secret = "secret",
  Credential = "password",
  SecureNote = "note",
}
export enum RecipientTypes {
  Group = "group",
  Collection = "collection",
  User = "user",
}
export type RecipientType = ValuesType<typeof RecipientTypes>;
export type SharedItemAccessLinkType = ValuesType<
  typeof SharedItemAccessLinkTypes
>;
export const SharedItemAccessLinkTypesSchema = z.nativeEnum(
  SharedItemAccessLinkTypes
);
export const RecipientTypeSchema = z.nativeEnum(RecipientTypes);
export interface SharedAccessMember {
  permission: Permission;
  status?: Status;
  recipientId: string;
  recipientName: string;
  recipientType: RecipientType;
}
export interface UserRecipient {
  type: RecipientTypes.User;
  alias: string;
}
export interface GroupRecipient {
  type: RecipientTypes.Group;
  groupId: string;
  name?: string;
}
