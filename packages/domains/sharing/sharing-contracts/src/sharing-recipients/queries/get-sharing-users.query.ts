import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SortDirection } from "../sharing-recipients.types";
export interface SharingUserContacts {
  id: "string";
  itemCount: number;
}
export type GetSharingUsersResult = SharingUserContacts[];
export type GetSharingUsersQueryParam = {
  spaceId: string | null;
  sortDirection: SortDirection;
};
export class GetSharingUsersQuery extends defineQuery<
  GetSharingUsersResult,
  never,
  GetSharingUsersQueryParam
>({
  scope: UseCaseScope.User,
}) {}
