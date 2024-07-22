import { z } from "zod";
import {
  Permission,
  PermissionSchema,
  RsaStatusSchema,
  StatusSchema,
} from "../common-types";
export const SharedCollectionUserSchema = z.object({
  acceptSignature: z.optional(z.nullable(z.string())),
  collectionKey: z.optional(z.nullable(z.string())),
  login: z.string(),
  permission: PermissionSchema,
  proposeSignature: z.optional(z.string()),
  proposeSignatureUsingAlias: z.optional(z.boolean()),
  referrer: z.string(),
  rsaStatus: z.optional(RsaStatusSchema),
  status: StatusSchema,
});
export const SharedCollectionUserGroupSchema = z.object({
  acceptSignature: z.optional(z.nullable(z.string())),
  collectionKey: z.optional(z.nullable(z.string())),
  name: z.string(),
  permission: PermissionSchema,
  proposeSignature: z.optional(z.string()),
  referrer: z.optional(z.string()),
  status: StatusSchema,
  uuid: z.string(),
});
export const SharedCollectionUserOrGroupViewSchema = z.object({
  label: z.string(),
  status: StatusSchema,
  permission: PermissionSchema,
  id: z.string(),
});
export const SharedCollectionSchema = z.object({
  name: z.string(),
  privateKey: z.string(),
  publicKey: z.string(),
  revision: z.number(),
  userGroups: z.optional(z.array(SharedCollectionUserGroupSchema)),
  users: z.optional(z.array(SharedCollectionUserSchema)),
  uuid: z.string(),
  authorLogin: z.optional(z.string()),
});
export const UsersAndGroupsInCollectionSchema = z.object({
  userGroups: z.optional(z.array(SharedCollectionUserOrGroupViewSchema)),
  users: z.optional(z.array(SharedCollectionUserOrGroupViewSchema)),
});
export const GetItemIdsInSharedCollectionsSchema = z.array(z.string());
export type SharedCollectionUser = z.infer<typeof SharedCollectionUserSchema>;
export type SharedCollectionUserGroup = z.infer<
  typeof SharedCollectionUserGroupSchema
>;
export type SharedCollectionUserOrGroupView = z.infer<
  typeof SharedCollectionUserOrGroupViewSchema
>;
export type SharedCollection = z.infer<typeof SharedCollectionSchema>;
export type UsersAndGroupsInCollection = z.infer<
  typeof UsersAndGroupsInCollectionSchema
>;
export type RsaStatus = z.infer<typeof RsaStatusSchema>;
export type GetItemIdsInSharedCollections = z.infer<
  typeof GetItemIdsInSharedCollectionsSchema
>;
export enum SharedCollectionRole {
  Editor = "editor",
  Manager = "manager",
}
export interface SharedCollectionUserRecipient {
  login: string;
  role: SharedCollectionRole;
}
export interface SharedCollectionUserGroupRecipient {
  groupId: string;
  role: SharedCollectionRole;
}
export enum SharingDisabledReason {
  DisabledInTAC = "disabledInTac",
  EditorRole = "editorRole",
  LimitedRightItems = "limitedRightItems",
}
export interface CollectionPermissions {
  role: SharedCollectionRole;
  canShare: boolean;
  canEditRoles: boolean;
  canEdit: boolean;
  canDelete: boolean;
  sharingDisabledReason?: SharingDisabledReason;
}
export interface CollectionItemPermission {
  collectionId: string;
  permission: Permission;
}
