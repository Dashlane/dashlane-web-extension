import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import {
  ItemsQueryResult,
  VaultItemsQueryParam,
  VaultItemsQueryResult,
} from "../../vault-items-crud";
import type { Collection } from "../../vault-organization";
export interface VaultSearchQueryResult extends VaultItemsQueryResult {
  collectionsResult: ItemsQueryResult<Collection>;
}
export interface VaultSearchParam extends Partial<VaultItemsQueryParam> {
  searchQuery: string;
  needDashlaneLinkedWebsites?: boolean;
}
export class VaultSearchQuery extends defineQuery<
  VaultSearchQueryResult,
  never,
  VaultSearchParam
>({
  scope: UseCaseScope.User,
}) {}
