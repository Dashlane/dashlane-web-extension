import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export interface SharingGroupContact {
  id: string;
  permission: string;
}
export interface SharingGroup {
  id: string;
  itemCount: number;
  name: string;
  users: SharingGroupContact[];
}
export type GetSharingGroupsResult = SharingGroup[];
export type GetSharingGroupsQueryParam = {
  spaceId: string | null;
  sortDirection: "ascend" | "descend";
};
export class GetSharingGroupsQuery extends defineQuery<
  GetSharingGroupsResult,
  never,
  GetSharingGroupsQueryParam
>({
  scope: UseCaseScope.User,
}) {}
