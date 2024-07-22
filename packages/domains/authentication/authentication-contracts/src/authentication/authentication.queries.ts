import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { Matchable } from "@dashlane/framework-types";
export const USER_NOT_LOGGED_IN = "USER_NOT_LOGGED_IN" as const;
export type UserNotLoggedInError = Matchable<typeof USER_NOT_LOGGED_IN>;
export type CanLockAppErrors = UserNotLoggedInError;
export class CanLockAppQuery extends defineQuery<boolean, CanLockAppErrors>({
  scope: UseCaseScope.User,
  noUserError: { tag: USER_NOT_LOGGED_IN },
}) {}
