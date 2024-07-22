import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export class GetSharedCollectionsCountQuery extends defineQuery<number>({
  scope: UseCaseScope.User,
}) {}
