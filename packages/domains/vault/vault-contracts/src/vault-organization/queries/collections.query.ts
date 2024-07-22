import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { Collection } from "../types/collection.types";
export type CollectionsQueryResult = {
  collections: Collection[];
};
export interface CollectionsQueryParam {
  ids?: string[];
}
export class CollectionsQuery extends defineQuery<
  CollectionsQueryResult,
  never,
  CollectionsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
