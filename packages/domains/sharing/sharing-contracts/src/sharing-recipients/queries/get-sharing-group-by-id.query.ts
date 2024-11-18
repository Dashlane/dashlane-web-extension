import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharingGroup } from "../sharing-recipients.types";
export type GetSharingGroupByIdResult = SharingGroup;
export type GetSharingGroupByIdsQueryParam = {
  id: string;
};
export class GetSharingGroupByIdQuery extends defineQuery<
  GetSharingGroupByIdResult,
  never,
  GetSharingGroupByIdsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
