import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedAccess } from "../sharing-items.types";
export type GetSharedAccessQueryResult = {
  sharedAccess: SharedAccess[];
};
export class GetSharedAccessQuery extends defineQuery<GetSharedAccessQueryResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
