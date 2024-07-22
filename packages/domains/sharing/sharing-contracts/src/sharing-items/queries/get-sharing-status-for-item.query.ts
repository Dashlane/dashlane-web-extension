import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetSharingStatusForItemResult =
  | {
      isShared: true;
      isSharedViaUserGroup: boolean;
    }
  | {
      isShared: false;
      isSharedViaUserGroup: false;
    };
export type GetSharingStatusForItemParam = {
  itemId: string;
};
export class GetSharingStatusForItemQuery extends defineQuery<
  GetSharingStatusForItemResult,
  never,
  GetSharingStatusForItemParam
>({
  scope: UseCaseScope.User,
}) {}
