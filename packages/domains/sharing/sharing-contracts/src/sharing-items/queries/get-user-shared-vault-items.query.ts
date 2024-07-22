import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetUserSharedVaultItemsResult = {
  sharedCredentials: unknown[];
  sharedSecureNotes: unknown[];
  sharedSecrets: unknown[];
};
export type GetUserSharedVaultItemsParam = {
  userId: string;
  groupId: string;
  query: string;
  spaceId: string | null;
};
export class GetUserSharedVaultItemsQuery extends defineQuery<
  GetUserSharedVaultItemsResult,
  never,
  GetUserSharedVaultItemsParam
>({
  scope: UseCaseScope.User,
}) {}
