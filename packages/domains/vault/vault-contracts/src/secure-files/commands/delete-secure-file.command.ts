import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
export enum DeleteSecureFileCommandErrors {
  NO_REMOTE_FILE = "no-remote-file",
  SECURE_FILE_QUOTA_UPDATE = "secure-file-quota-update",
}
export const createNoRemoteFileError = defineFunctionalError(
  DeleteSecureFileCommandErrors.NO_REMOTE_FILE,
  "The user doesn't have access to this secure file or it has already been deleted."
);
export type NoRemoteFileError = FunctionalErrorOf<
  typeof DeleteSecureFileCommandErrors.NO_REMOTE_FILE
>;
export const createSecureFileQuotaUpdateError = defineFunctionalError(
  DeleteSecureFileCommandErrors.SECURE_FILE_QUOTA_UPDATE,
  "The secure file quota state update failed."
);
export type SecureFileQuotaUpdateFailed = FunctionalErrorOf<
  typeof DeleteSecureFileCommandErrors.SECURE_FILE_QUOTA_UPDATE
>;
export interface DeleteSecureFileCommandParam {
  id: string;
}
export class DeleteSecureFileCommand extends defineCommand<
  DeleteSecureFileCommandParam,
  undefined,
  NoRemoteFileError | SecureFileQuotaUpdateFailed
>({
  scope: UseCaseScope.User,
}) {}
