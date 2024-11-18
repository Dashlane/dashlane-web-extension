import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedItem } from "../sharing-items.types";
export type GetSharedItemForIdQueryParam = {
  itemId: string;
};
export interface GetSharedItemForIdQueryResult {
  sharedItem: SharedItem | null;
}
export class GetSharedItemForIdQuery extends defineQuery<
  GetSharedItemForIdQueryResult,
  never,
  GetSharedItemForIdQueryParam
>({
  scope: UseCaseScope.User,
}) {}
