import { z } from "zod";
import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export const ShareableCollectionVaultItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  url: z.optional(z.string()),
});
export const ShareableCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  spaceId: z.string(),
  vaultItems: z.array(ShareableCollectionVaultItemSchema),
  isShared: z.optional(z.boolean()),
});
export type ShareableCollectionVaultItem = z.infer<
  typeof ShareableCollectionVaultItemSchema
>;
export type ShareableCollection = z.infer<typeof ShareableCollectionSchema>;
export class SharedCollectionsWithItemsQuery extends defineQuery<
  ShareableCollection[]
>({
  scope: UseCaseScope.User,
}) {}
