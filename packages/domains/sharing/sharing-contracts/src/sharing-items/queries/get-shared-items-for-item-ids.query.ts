import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedItem } from "../sharing-items.types";
export type GetSharedItemsForItemIdsResult = {
  sharedItems: SharedItem[];
};
export type GetSharedItemsForItemIdsParam = {
  itemIds: string[];
};
export class GetSharedItemsForItemIdsQuery extends defineQuery<
  GetSharedItemsForItemIdsResult,
  never,
  GetSharedItemsForItemIdsParam
>({
  scope: UseCaseScope.User,
}) {}
