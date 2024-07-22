import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type SharedItemsIdsResult = string[];
export class SharedItemsIdsQuery extends defineQuery<SharedItemsIdsResult>({
  scope: UseCaseScope.User,
}) {}
