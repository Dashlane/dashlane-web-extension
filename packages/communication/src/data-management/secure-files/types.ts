import { SecureFileInfo } from "../../DataModel";
export enum SecureFileResultErrorCode {
  MAX_CONTENT_LENGTH_EXCEEDED = "MAX_CONTENT_LENGTH_EXCEEDED",
  QUOTA_EXCEEDED = "QUOTA_EXCEEDED",
  INVALID_FILE_TYPE = "INVALID_FILE_TYPE",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
}
export interface DownloadSecureFileRequest {
  downloadKey: string;
  cryptoKey: string;
}
interface DownloadSecureFileResultSuccess {
  success: true;
}
interface DownloadSecureFileResultError {
  success: false;
  error?: {
    code: SecureFileResultErrorCode;
  };
}
export type DownloadSecureFileResult =
  | DownloadSecureFileResultSuccess
  | DownloadSecureFileResultError;
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
export interface UpdateSecureFileQuotaRequest {
  quota: SecureFilesQuota;
}
export interface UpdateSecureFileQuotaResult {
  success: true;
}
interface InitSecureFilesStorageInfoResultSuccess {
  success: true;
}
interface InitSecureFilesStorageInfoResultError {
  success: false;
  error?: {
    code: SecureFileResultErrorCode;
  };
}
export type InitSecureFilesStorageInfoResult =
  | InitSecureFilesStorageInfoResultSuccess
  | InitSecureFilesStorageInfoResultError;
export interface SecureFilesQuota {
  remaining: number;
  max: number;
}
export enum FileDownloadStatus {
  Initial = "Initial",
  Downloading = "Downloading",
  Deciphering = "Deciphering",
  Error = "Error",
  ChunkReady = "ChunkReady",
  ChunkDownloaded = "ChunkDownloaded",
  TransferComplete = "TransferComplete",
}
export enum FileUploadStatus {
  None = "None",
  Initial = "Initial",
  Uploading = "Uploading",
  Ciphering = "Ciphering",
  Done = "Done",
  Error = "Error",
}
export interface FileDownloadContentProgress {
  status: FileDownloadStatus.Downloading | FileDownloadStatus.Initial;
  bytesReceived: number;
  contentLength: number;
}
export interface FileDownloadTransferProgress {
  status: FileDownloadStatus.ChunkDownloaded | FileDownloadStatus.ChunkReady;
  chunks: string[];
  currentChunkIndex: number;
}
export type SecureFileDownloadProgress =
  | {
      status:
        | FileDownloadStatus.Deciphering
        | FileDownloadStatus.Error
        | FileDownloadStatus.TransferComplete;
    }
  | FileDownloadTransferProgress
  | FileDownloadContentProgress;
export interface SecureFileUploadProgress {
  status: FileUploadStatus;
  bytesSent: number;
  contentLength: number;
}
interface FileDownloadTransferProgressView {
  status: FileDownloadStatus.ChunkDownloaded | FileDownloadStatus.ChunkReady;
  chunk: string;
}
export type SecureFileDownloadProgressView =
  | {
      status:
        | FileDownloadStatus.Deciphering
        | FileDownloadStatus.Error
        | FileDownloadStatus.TransferComplete;
    }
  | FileDownloadTransferProgressView
  | FileDownloadContentProgress;
