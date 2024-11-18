import {
  defineFunctionalError,
  Failure,
  FunctionalErrorOf,
  Result,
  Success,
} from "@dashlane/framework-types";
import {
  DeleteItemGroupModel,
  ItemGroup,
  ItemGroupCreateModel,
  RevokeItemGroupMembersModel,
  UpdateItemGroupMembersModel,
  UserWithPublicKey,
} from "../sharing.types";
export const ITEM_GROUP_MEMBER_INVALID_REVISION = "INVALID_ITEM_GROUP_REVISION";
export const itemGroupMemberInvalidRevisionError = defineFunctionalError(
  ITEM_GROUP_MEMBER_INVALID_REVISION,
  "Invalid revision when trying to update item group member"
);
export type ItemGroupMemberError = FunctionalErrorOf<
  typeof ITEM_GROUP_MEMBER_INVALID_REVISION
>;
export abstract class SharingCommonGateway {
  abstract getPublicKeysForUsers: (
    users: string[]
  ) => Promise<UserWithPublicKey[]>;
  abstract createItemGroup: (model: ItemGroupCreateModel) => Promise<ItemGroup>;
  abstract createMultipleItemGroups: (
    models: ItemGroupCreateModel[]
  ) => Promise<ItemGroup[]>;
  abstract updateItemGroupMembers: (
    models: UpdateItemGroupMembersModel
  ) => Promise<
    Success<ItemGroup[] | undefined> | Failure<ItemGroupMemberError>
  >;
  abstract revokeItemGroupMembers: (
    models: RevokeItemGroupMembersModel
  ) => Promise<
    Success<ItemGroup[] | undefined> | Failure<ItemGroupMemberError>
  >;
  abstract refuseItemGroup: (
    models: RevokeItemGroupMembersModel
  ) => Promise<ItemGroup[]>;
  abstract deleteItemGroup: (
    models: DeleteItemGroupModel
  ) => Promise<Result<undefined>>;
}
