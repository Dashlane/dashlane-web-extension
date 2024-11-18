import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharingGroup, SortDirection } from "../sharing-recipients.types";
export type GetSharingGroupsWithItemCountResult = SharingGroup[];
export type GetSharingGroupsWithItemCountQueryParam = {
  sortDirection: SortDirection;
};
export class GetSharingGroupsWithItemCountQuery extends defineQuery<
  GetSharingGroupsWithItemCountResult,
  never,
  GetSharingGroupsWithItemCountQueryParam
>({
  scope: UseCaseScope.User,
}) {}
