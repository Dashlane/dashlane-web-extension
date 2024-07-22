import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { FunctionalError } from "@dashlane/framework-types";
export interface AcceptCollectionInviteCommandParam {
  collectionId: string;
}
export enum AcceptCollectionInviteResultErrorCode {
  AcceptFailed = "AcceptFailed",
}
export class AcceptCollectionInviteFailedError extends FunctionalError(
  AcceptCollectionInviteResultErrorCode.AcceptFailed,
  "Failed to accept collection"
) {}
export type AcceptCollectionInviteError = AcceptCollectionInviteFailedError;
export class AcceptCollectionInviteCommand extends defineCommand<
  AcceptCollectionInviteCommandParam,
  undefined,
  AcceptCollectionInviteError
>({ scope: UseCaseScope.User }) {}
