import { SecureFileInfo } from "../../DataModel";
export enum SecureFileResultErrorCode {
  MAX_CONTENT_LENGTH_EXCEEDED = "MAX_CONTENT_LENGTH_EXCEEDED",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  HARD_QUOTA_EXCEEDED = "HARD_QUOTA_EXCEEDED",
  SOFT_QUOTA_EXCEEDED = "SOFT_QUOTA_EXCEEDED",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
}
export interface AddSecureFileRequest {
  fileName: string;
  fileType: string;
  serializedContent: string;
}
interface AddSecureFileResultSuccess {
  success: true;
  secureFileInfo: SecureFileInfo;
}
interface AddSecureFileResultError {
  success: false;
  error?: {
    code: SecureFileResultErrorCode;
  };
}
export type AddSecureFileResult =
  | AddSecureFileResultSuccess
  | AddSecureFileResultError;
export interface ValidateSecureFileRequest {
  fileName: string;
  fileType: string;
  contentLength: number;
}
interface ValidateSecureFileResultSuccess {
  success: true;
}
interface ValidateSecureFileResultError {
  success: false;
  error?: {
    code: SecureFileResultErrorCode;
  };
}
export type ValidateSecureFileResult =
  | ValidateSecureFileResultSuccess
  | ValidateSecureFileResultError;
export interface CommitSecureFileRequest {
  secureFileInfo: SecureFileInfo;
}
interface CommitSecureFileResultSuccess {
  success: true;
}
interface CommitSecureFileResultError {
  success: false;
}
export type CommitSecureFileResult =
  | CommitSecureFileResultSuccess
  | CommitSecureFileResultError;
export enum FileUploadStatus {
  None = "None",
  Initial = "Initial",
  Uploading = "Uploading",
  Ciphering = "Ciphering",
  Done = "Done",
  Error = "Error",
}
export interface SecureFileUploadProgress {
  status: FileUploadStatus;
  bytesSent: number;
  contentLength: number;
}
