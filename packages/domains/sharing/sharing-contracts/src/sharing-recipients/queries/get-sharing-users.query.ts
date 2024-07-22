import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export interface SharingUserContacts {
  id: "string";
  itemCount: number;
}
export type GetSharingUsersResult = SharingUserContacts[];
export type GetSharingUsersQueryParam = {
  spaceId: string | null;
  sortDirection: "ascend" | "descend";
};
export class GetSharingUsersQuery extends defineQuery<
  GetSharingUsersResult,
  never,
  GetSharingUsersQueryParam
>({
  scope: UseCaseScope.User,
}) {}
