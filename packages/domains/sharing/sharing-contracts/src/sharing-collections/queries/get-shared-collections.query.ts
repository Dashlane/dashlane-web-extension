import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedCollection } from "../sharing-collections.types";
export interface GetSharedCollectionsQueryParam {
  collectionIds?: string[];
}
export class GetSharedCollectionsQuery extends defineQuery<
  SharedCollection[],
  never,
  GetSharedCollectionsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
