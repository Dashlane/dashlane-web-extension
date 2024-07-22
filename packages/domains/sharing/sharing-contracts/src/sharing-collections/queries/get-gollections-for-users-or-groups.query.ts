import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedCollection } from "../sharing-collections.types";
export interface GetCollectionsForUserOrGroupQueryParam {
  targetId: string;
}
export interface GetCollectionsForUserOrGroupResponse {
  collections: SharedCollection[];
}
export class GetCollectionsForUserOrGroupQuery extends defineQuery<
  GetCollectionsForUserOrGroupResponse,
  never,
  GetCollectionsForUserOrGroupQueryParam
>({
  scope: UseCaseScope.User,
}) {}
