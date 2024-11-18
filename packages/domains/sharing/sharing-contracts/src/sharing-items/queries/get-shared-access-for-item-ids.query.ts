import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedAccess } from "../sharing-items.types";
export type GetSharedAccessForItemIdsQueryResult = {
  sharedAccess: SharedAccess[];
};
export type GetSharedAccessForItemIdsQueryParam = {
  itemIds: string[];
};
export class GetSharedAccessForItemIdsQuery extends defineQuery<
  GetSharedAccessForItemIdsQueryResult,
  never,
  GetSharedAccessForItemIdsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
