import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { VaultItemType } from "../types";
import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
export interface DeleteVaultItemCommandParam {
  vaultItemType: VaultItemType;
  id: string;
  ignoreSharing?: boolean;
}
export const DeleteVaultItemCommandErrors = Object.freeze({
  NOT_FOUND: "NOT_FOUND",
  FORBIDDEN_GROUP_ITEM: "FORBIDDEN_GROUP_ITEM",
  FORBIDDEN_LAST_ADMIN: "FORBIDDEN_LAST_ADMIN",
});
export const createItemNotFoundError = defineFunctionalError(
  DeleteVaultItemCommandErrors.NOT_FOUND,
  "The Vault Item to be deleted couldn't be found."
);
export type ItemNotFoundError = FunctionalErrorOf<
  typeof DeleteVaultItemCommandErrors.NOT_FOUND
>;
export const createForbiddenGroupItemError = defineFunctionalError(
  DeleteVaultItemCommandErrors.FORBIDDEN_GROUP_ITEM,
  "The Vault Item cannot be deleted while shared via user group."
);
export type ForbiddenGroupItemError = FunctionalErrorOf<
  typeof DeleteVaultItemCommandErrors.FORBIDDEN_GROUP_ITEM
>;
export const createForbiddenLastAdminError = defineFunctionalError(
  DeleteVaultItemCommandErrors.FORBIDDEN_LAST_ADMIN,
  "The Vault Item cannot be deleted while the current user is the last admin."
);
export type ForbiddenLastAdminError = FunctionalErrorOf<
  typeof DeleteVaultItemCommandErrors.FORBIDDEN_LAST_ADMIN
>;
export class DeleteVaultItemCommand extends defineCommand<
  DeleteVaultItemCommandParam,
  undefined,
  ItemNotFoundError | ForbiddenGroupItemError | ForbiddenLastAdminError
>({
  scope: UseCaseScope.User,
}) {}
