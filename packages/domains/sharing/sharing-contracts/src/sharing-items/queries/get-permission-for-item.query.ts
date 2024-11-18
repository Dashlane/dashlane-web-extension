import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { Permission } from "../../common-types";
export type GetPermissionForItemResult = {
  permission: Permission | undefined;
};
export type GetPermissionForItemParam = {
  itemId: string;
};
export class GetPermissionForItemQuery extends defineQuery<
  GetPermissionForItemResult,
  never,
  GetPermissionForItemParam
>({
  scope: UseCaseScope.User,
  useCache: true,
}) {}
