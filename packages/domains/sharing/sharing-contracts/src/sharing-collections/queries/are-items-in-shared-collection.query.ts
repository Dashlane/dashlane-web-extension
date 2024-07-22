import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { GetItemIdsInSharedCollections } from "../sharing-collections.types";
export interface GetItemIdsInSharedCollectionsQueryParam {
  itemIds: string[];
}
export class GetItemIdsInSharedCollectionsQuery extends defineQuery<
  GetItemIdsInSharedCollections,
  never,
  GetItemIdsInSharedCollectionsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
