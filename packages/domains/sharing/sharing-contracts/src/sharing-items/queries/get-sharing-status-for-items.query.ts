import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type SharingStatus = {
  isShared: boolean;
  isSharedViaUserGroup: boolean;
};
export type GetSharingStatusForItemsResult = Record<string, SharingStatus>;
export type GetSharingStatusForItemsParam = {
  itemIds: string[];
};
export class GetSharingStatusForItemsQuery extends defineQuery<
  GetSharingStatusForItemsResult,
  never,
  GetSharingStatusForItemsParam
>({
  scope: UseCaseScope.User,
}) {}
