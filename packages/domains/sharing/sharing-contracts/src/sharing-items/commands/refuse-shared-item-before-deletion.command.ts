import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
export const RefuseSharedItemBeforeDeletionCommandErrors = Object.freeze({
  FORBIDDEN_GROUP_ITEM: "FORBIDDEN_GROUP_ITEM",
  FORBIDDEN_LAST_ADMIN: "FORBIDDEN_LAST_ADMIN",
});
export const createForbiddenGroupItemError = defineFunctionalError(
  RefuseSharedItemBeforeDeletionCommandErrors.FORBIDDEN_GROUP_ITEM,
  "The Vault Item cannot be deleted while shared via user group."
);
export type ForbiddenGroupItemError = FunctionalErrorOf<
  typeof RefuseSharedItemBeforeDeletionCommandErrors.FORBIDDEN_GROUP_ITEM
>;
export const createForbiddenLastAdminError = defineFunctionalError(
  RefuseSharedItemBeforeDeletionCommandErrors.FORBIDDEN_LAST_ADMIN,
  "The Vault Item cannot be deleted while the current user is the last admin."
);
export type ForbiddenLastAdminError = FunctionalErrorOf<
  typeof RefuseSharedItemBeforeDeletionCommandErrors.FORBIDDEN_LAST_ADMIN
>;
export interface RefuseSharedItemBeforeDeletionCommandParam {
  vaultItemId: string;
}
export class RefuseSharedItemBeforeDeletionCommand extends defineCommand<
  RefuseSharedItemBeforeDeletionCommandParam,
  undefined,
  ForbiddenGroupItemError | ForbiddenLastAdminError
>({ scope: UseCaseScope.User }) {}
