import { z } from "zod";
import {
  PermissionSchema,
  SharedCollectionAccessSchema,
  SharedCollectionSchema,
} from "@dashlane/sharing-contracts";
import { SharedCollectionAccessLinkTypes } from "../../utils/mappers/collection-access-types";
export const SharedCollectionAccessLinkTypesSchema = z.nativeEnum(
  SharedCollectionAccessLinkTypes
);
const CollectionAccessLinkBaseSchema = z.object({
  permission: PermissionSchema,
  proposeSignature: z.optional(z.string()),
  acceptSignature: z.optional(z.nullable(z.string())),
  encryptedResourceKey: z.string(),
  accessType: SharedCollectionAccessLinkTypesSchema,
});
export const DirectAccessSchema = CollectionAccessLinkBaseSchema.extend({
  accessType: z.literal(SharedCollectionAccessLinkTypes.User),
});
export type DirectAccess = z.infer<typeof DirectAccessSchema>;
export const UserGroupAccessSchema = CollectionAccessLinkBaseSchema.extend({
  accessType: z.literal(SharedCollectionAccessLinkTypes.UserGroup),
  groupEncryptedKey: z.optional(z.string()),
  groupPrivateKey: z.optional(z.string()),
  groupPublicKey: z.optional(z.string()),
});
export type UserGroupAccess = z.infer<typeof UserGroupAccessSchema>;
export const CollectionKeyDecryptionLinkSchema = z.union([
  DirectAccessSchema,
  UserGroupAccessSchema,
]);
export type CollectionKeyDecryptionLink = z.infer<
  typeof CollectionKeyDecryptionLinkSchema
>;
export const SharedCollectionsStateLegacySchema = z.object({
  sharedCollections: z.array(SharedCollectionSchema),
});
export type SharedCollectionsLegacyState = z.infer<
  typeof SharedCollectionsStateLegacySchema
>;
export const SharedCollectionStateSchema = z.object({
  id: z.string(),
  name: z.string(),
  privateKey: z.string(),
  publicKey: z.string(),
  revision: z.number(),
  isAccepted: z.boolean(),
  permission: PermissionSchema,
  accessLink: z.optional(CollectionKeyDecryptionLinkSchema),
  isLastAdmin: z.boolean(),
  pendingDirectAccess: z.optional(
    z.object({ referrer: z.string(), permission: PermissionSchema })
  ),
});
export type SharedCollectionState = z.infer<typeof SharedCollectionStateSchema>;
export type SharedAccessCollectionState = z.infer<
  typeof SharedCollectionAccessSchema
>;
export const SharedCollectionsStateSchema = z.object({
  collections: z.record(SharedCollectionStateSchema),
  sharedCollectionsAccess: z.record(SharedCollectionAccessSchema),
});
export type SharedCollectionsState = z.infer<
  typeof SharedCollectionsStateSchema
>;
