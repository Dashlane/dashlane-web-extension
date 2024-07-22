import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { Permission } from "../../common-types";
export type GetPermissionForItemsResult = {
  [itemId: string]: Permission | undefined;
};
export type GetPermissionForItemsParam = {
  itemIds: string[];
};
export class GetPermissionForItemsQuery extends defineQuery<
  GetPermissionForItemsResult,
  never,
  GetPermissionForItemsParam
>({
  scope: UseCaseScope.User,
}) {}
