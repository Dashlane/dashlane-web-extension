import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export enum ShareItemFailureReason {
  ITEM_DOESNT_EXIST,
  LIMIT_EXCEEDED,
  ITEM_HAS_ATTACHMENTS,
  INVALID_REVISION,
  SHARING_FAILED,
}
export interface ShareItemError {
  id: string;
  title: string;
  reason: ShareItemFailureReason;
}
export type ShareCredentialError = ShareItemError & {
  domain?: string;
  text: string;
};
export type ShareNoteError = ShareItemError & {
  color: string;
};
export type ShareItemsErrorsResult = {
  credentialsErrors: Array<ShareCredentialError>;
  notesErrors: Array<ShareNoteError>;
  secretsErrors: Array<ShareItemError>;
};
export class ShareItemsErrorsQuery extends defineQuery<ShareItemsErrorsResult>({
  scope: UseCaseScope.User,
}) {}
