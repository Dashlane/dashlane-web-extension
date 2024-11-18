import { z } from "zod";
import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { RsaStatusSchema, StatusSchema } from "../..";
const UserDownloadSchema = z.object({
  userId: z.string(),
  alias: z.string(),
  referrer: z.string(),
  groupKey: z.string().nullable().optional(),
  permission: z.enum(["admin", "limited"]),
  rsaStatus: RsaStatusSchema,
  status: StatusSchema,
});
const SpecialUserGroupDownloadSchema = z.object({
  groupId: z.string(),
  name: z.string(),
  type: z.literal("teamAdmins"),
  publicKey: z.string(),
  privateKey: z.string(),
  revision: z.number(),
  users: z.array(UserDownloadSchema),
});
export type SpecialUserGroupDownload = z.infer<
  typeof SpecialUserGroupDownloadSchema
>;
const SpecialItemGroupDownloadSchema = z.object({
  groupId: z.string(),
  items: z
    .array(z.object({ itemId: z.string(), itemKey: z.string() }))
    .optional(),
  revision: z.number(),
  type: z.literal("userGroupKeys"),
  users: z.array(UserDownloadSchema).optional(),
});
export type SpecialItemGroupDownload = z.infer<
  typeof SpecialItemGroupDownloadSchema
>;
const ItemContentSchema = z.object({
  content: z.string(),
  timestamp: z.number(),
  itemId: z.string(),
});
export const TeamAdminSharingDataSchema = z.object({
  specialItemGroup: SpecialItemGroupDownloadSchema.optional(),
  specialUserGroup: SpecialUserGroupDownloadSchema.optional(),
  specialItems: z.record(ItemContentSchema).optional(),
});
export type TeamAdminSharingData = z.infer<typeof TeamAdminSharingDataSchema>;
export class GetTeamAdminSharingDataQuery extends defineQuery<TeamAdminSharingData>(
  {
    scope: UseCaseScope.User,
  }
) {}
