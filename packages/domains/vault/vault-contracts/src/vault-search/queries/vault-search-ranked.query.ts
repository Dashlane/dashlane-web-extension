import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { VaultItem, VaultItemsQueryParam } from "../../vault-items-crud";
import { Collection } from "../../vault-organization";
export interface VaultSearchRankedParam extends Partial<VaultItemsQueryParam> {
  searchQuery: string;
}
export interface VaultSearchRankedQueryResult {
  items: (VaultItem | Collection)[];
  matchCount: number;
}
export class VaultSearchRankedQuery extends defineQuery<
  VaultSearchRankedQueryResult,
  never,
  VaultSearchRankedParam
>({
  scope: UseCaseScope.User,
}) {}
