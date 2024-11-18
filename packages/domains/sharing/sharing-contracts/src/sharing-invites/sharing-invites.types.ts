import { z } from "zod";
import {
  Permission,
  PermissionSchema,
  ShareableItemType,
} from "../common-types";
export const PendingCollectionSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  referrer: z.string(),
  permission: z.nativeEnum(Permission),
});
export const PendingItemGroupSchema = z.object({
  itemGroupId: z.string(),
  referrer: z.string(),
  permission: z.enum(["admin", "limited"]),
  items: z.array(z.any()),
});
export const PendingUserGroupSchema = z.object({
  groupId: z.string(),
  name: z.string(),
  referrer: z.string(),
  permission: z.enum(["admin", "limited"]),
});
export type PendingCollection = z.infer<typeof PendingCollectionSchema>;
export type PendingItemGroup = z.infer<typeof PendingItemGroupSchema>;
export type PendingUserGroup = z.infer<typeof PendingUserGroupSchema>;
const BasePendingInviteSchema = z.object({
  referrer: z.string(),
  permission: PermissionSchema,
});
export const PendingInviteSchema = BasePendingInviteSchema.extend({
  id: z.string(),
  name: z.string(),
});
export type PendingInvite = z.infer<typeof PendingInviteSchema>;
const BasePendingSharedItemInviteSchema = BasePendingInviteSchema.extend({
  vaultItemId: z.string(),
  sharedItemId: z.string(),
  revision: z.number(),
  title: z.string(),
  spaceId: z.optional(z.string()),
});
const PendingCredentialInviteSchema = BasePendingSharedItemInviteSchema.extend({
  itemType: z.literal(ShareableItemType.Credential),
  url: z.optional(z.string()),
  login: z.optional(z.string()),
  secondaryLogin: z.optional(z.string()),
  email: z.optional(z.string()),
  linkedDomains: z.optional(z.array(z.string())),
});
export type PendingCredentialInvite = z.infer<
  typeof PendingCredentialInviteSchema
>;
const PendingSecureNoteInviteSchema = BasePendingSharedItemInviteSchema.extend({
  itemType: z.literal(ShareableItemType.SecureNote),
  color: z.optional(z.string()),
  secured: z.boolean(),
});
export type PendingSecureNoteInvite = z.infer<
  typeof PendingSecureNoteInviteSchema
>;
const PendingSecretInviteSchema = BasePendingSharedItemInviteSchema.extend({
  itemType: z.literal(ShareableItemType.Secret),
  secured: z.boolean(),
});
export type PendingSecretInvite = z.infer<typeof PendingSecretInviteSchema>;
export const PendingSharedItemInviteSchema = z.union([
  PendingCredentialInviteSchema,
  PendingSecureNoteInviteSchema,
  PendingSecretInviteSchema,
]);
export type PendingSharedItemInvite = z.infer<
  typeof PendingSharedItemInviteSchema
>;
