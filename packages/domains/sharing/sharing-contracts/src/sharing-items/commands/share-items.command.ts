import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { Permission } from "../../common-types";
import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
export interface ShareItemRequestPayload {
  vaultItemIds: string[];
  permission: Permission;
  userLogins: string[];
  userGroupIds: string[];
}
export enum ShareItemsErrorType {
  LIMIT_EXCEEDED = "LIMIT_EXCEEDED",
  PARTIAL_SUCCESS = "PARTIAL_SUCCESS",
}
export const createLimitExceededError = defineFunctionalError(
  ShareItemsErrorType.LIMIT_EXCEEDED,
  "Sharing limit exceeded"
);
export const createPartialSuccessError = defineFunctionalError(
  ShareItemsErrorType.PARTIAL_SUCCESS,
  "Some items were shared successfully, but not all"
);
export type LimitExceededError =
  FunctionalErrorOf<ShareItemsErrorType.LIMIT_EXCEEDED>;
export type PartialSuccessError =
  FunctionalErrorOf<ShareItemsErrorType.PARTIAL_SUCCESS>;
export type ShareItemsError = LimitExceededError | PartialSuccessError;
export class ShareItemsCommand extends defineCommand<
  ShareItemRequestPayload,
  undefined,
  ShareItemsError
>({
  scope: UseCaseScope.User,
}) {}
