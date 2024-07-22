import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { PendingCollection } from "../sharing-invites.types";
export class GetPendingCollectionsQuery extends defineQuery<
  PendingCollection[]
>({
  scope: UseCaseScope.User,
}) {}
