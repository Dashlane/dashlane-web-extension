import { z } from "zod";
import {
  PermissionSchema,
  SharedItemAccessLinkTypes,
  SharedItemAccessLinkTypesSchema,
} from "../common-types";
const SharedItemAccessLinkBaseSchema = z.object({
  permission: PermissionSchema,
  proposeSignature: z.optional(z.string()),
  acceptSignature: z.optional(z.nullable(z.string())),
  encryptedResourceKey: z.string(),
  accessType: SharedItemAccessLinkTypesSchema,
});
export type SharedItemAccessLinkBase = z.infer<
  typeof SharedItemAccessLinkBaseSchema
>;
export const DirectAccessSchema = SharedItemAccessLinkBaseSchema.extend({
  accessType: z.literal(SharedItemAccessLinkTypes.User),
});
export type DirectAccess = z.infer<typeof DirectAccessSchema>;
export const UserGroupAccessSchema = SharedItemAccessLinkBaseSchema.extend({
  accessType: z.literal(SharedItemAccessLinkTypes.UserGroup),
  groupEncryptedKey: z.optional(z.string()),
  groupPrivateKey: z.optional(z.string()),
});
export type UserGroupAccess = z.infer<typeof UserGroupAccessSchema>;
export const CollectionUserAccessSchema = SharedItemAccessLinkBaseSchema.extend(
  {
    accessType: z.literal(SharedItemAccessLinkTypes.CollectionUser),
    collectionEncryptedKey: z.optional(z.string()),
    collectionPrivateKey: z.optional(z.string()),
  }
);
export type CollectionUserAccess = z.infer<typeof CollectionUserAccessSchema>;
export const CollectionUserGroupAccessSchema =
  SharedItemAccessLinkBaseSchema.extend({
    accessType: z.literal(SharedItemAccessLinkTypes.CollectionUserGroup),
    collectionEncryptedKey: z.optional(z.string()),
    collectionPrivateKey: z.optional(z.string()),
    groupEncryptedKey: z.optional(z.string()),
    groupPrivateKey: z.optional(z.string()),
  });
export type CollectionUserGroupAccess = z.infer<
  typeof CollectionUserGroupAccessSchema
>;
export const SharedItemDecryptionLinkSchema = z.union([
  DirectAccessSchema,
  UserGroupAccessSchema,
  CollectionUserAccessSchema,
  CollectionUserGroupAccessSchema,
]);
export type SharedItemDecryptionLink = z.infer<
  typeof SharedItemDecryptionLinkSchema
>;
export const SharedItemRecipientIdsSchema = z.object({
  userIds: z.optional(z.nullable(z.array(z.string()))),
  collectionIds: z.optional(z.nullable(z.array(z.string()))),
  userGroupIds: z.optional(z.nullable(z.array(z.string()))),
});
export type SharedItemRecipientIds = z.infer<
  typeof SharedItemRecipientIdsSchema
>;
export const SharedItemSchema = z.object({
  accessLink: z.optional(SharedItemDecryptionLinkSchema),
  sharedItemId: z.string(),
  itemId: z.string(),
  itemKey: z.string(),
  revision: z.number(),
  recipientIds: SharedItemRecipientIdsSchema,
  permission: PermissionSchema,
  isLastAdmin: z.boolean(),
});
export type SharedItem = z.infer<typeof SharedItemSchema>;
