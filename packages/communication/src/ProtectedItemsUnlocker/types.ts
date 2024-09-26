export enum UnlockProtectedItemsStatus {
  SUCCESS = "success",
  ERROR = "error",
}
export interface UnlockProtectedItemsSuccessResult {
  status: UnlockProtectedItemsStatus.SUCCESS;
}
export const unlockProtectedItemsWrongPasswordError = "WRONG PASSWORD";
export interface UnlockProtectedItemsErrorResult {
  status: UnlockProtectedItemsStatus.ERROR;
  error: {
    code: typeof unlockProtectedItemsWrongPasswordError;
  };
}
export type UnlockProtectedItemsResult =
  | UnlockProtectedItemsErrorResult
  | UnlockProtectedItemsSuccessResult;
export interface DisableCredentialProtectionRequest {
  credentialId: string;
}
export enum DisableCredentialProtectionStatus {
  SUCCESS = "success",
  ERROR = "error",
}
interface DisableCredentialProtectionSuccessResult {
  status: DisableCredentialProtectionStatus.SUCCESS;
}
interface DisableCredentialProtectionFailureResult {
  status: DisableCredentialProtectionStatus.ERROR;
}
export type DisableCredentialProtectionResult =
  | DisableCredentialProtectionSuccessResult
  | DisableCredentialProtectionFailureResult;
