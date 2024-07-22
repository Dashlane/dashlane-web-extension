import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetItemGroupIdForItemIdResult = {
  itemGroupId?: string;
};
export type GetItemGroupIdForItemIdParam = {
  itemId: string;
};
export class GetItemGroupIdForItemIdQuery extends defineQuery<
  GetItemGroupIdForItemIdResult,
  never,
  GetItemGroupIdForItemIdParam
>({
  scope: UseCaseScope.User,
}) {}
