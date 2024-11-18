import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedItem } from "../sharing-items.types";
export type GetSharedItemsQueryResult = {
  sharedItems: SharedItem[];
};
export class GetSharedItemsQuery extends defineQuery<GetSharedItemsQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
