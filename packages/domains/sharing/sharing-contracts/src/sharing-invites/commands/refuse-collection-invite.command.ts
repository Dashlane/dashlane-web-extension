import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { FunctionalError } from "@dashlane/framework-types";
export interface RefuseCollectionInviteCommandParam {
  collectionId: string;
}
export enum RefuseCollectionInviteResultErrorCode {
  RefuseFailed = "RefuseFailed",
}
export class RefuseCollectionInviteFailedError extends FunctionalError(
  RefuseCollectionInviteResultErrorCode.RefuseFailed,
  "Failed to refuse collection"
) {}
export type RefuseCollectionInviteError = RefuseCollectionInviteFailedError;
export class RefuseCollectionInviteCommand extends defineCommand<
  RefuseCollectionInviteCommandParam,
  undefined,
  RefuseCollectionInviteError
>({ scope: UseCaseScope.User }) {}
