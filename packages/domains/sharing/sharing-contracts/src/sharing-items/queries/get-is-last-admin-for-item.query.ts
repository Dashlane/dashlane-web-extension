import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetIsLastAdminForItemResult = {
  isLastAdmin: boolean;
};
export type GetIsLastAdminForItemParam = {
  itemId: string;
};
export class GetIsLastAdminForItemQuery extends defineQuery<
  GetIsLastAdminForItemResult,
  never,
  GetIsLastAdminForItemParam
>({
  scope: UseCaseScope.User,
}) {}
