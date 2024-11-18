import { SecureFilesQuota } from "@dashlane/communication";
export const SECURE_FILE_SET_STORAGE_INFO = "SECURE_FILE_SET_STORAGE_INFO";
export const SECURE_FILE_CLEAR = "SECURE_FILE_CLEAR";
export const SECURE_FILE_START_DOWNLOAD = "SECURE_FILE_START_DOWNLOAD";
export const SECURE_FILE_CHUNK_READY = "SECURE_FILE_CHUNK_READY";
export const SECURE_FILE_CHUNK_TRANSFER_DONE =
  "SECURE_FILE_CHUNK_TRANSFER_DONE";
export const SECURE_FILE_DOWNLOAD_ERROR = "SECURE_FILE_DOWNLOAD_ERROR";
export const SECURE_FILE_DOWNLOAD_CHUNK = "SECURE_FILE_DOWNLOAD_CHUNK";
export const SECURE_FILE_START_DECIPHERING = "SECURE_FILE_START_DECIPHERING";
export const SECURE_FILE_START_UPLOAD = "SECURE_FILE_START_UPLOAD";
export const SECURE_FILE_UPLOAD_DONE = "SECURE_FILE_UPLOAD_DONE";
export const SECURE_FILE_UPLOAD_CLEAR = "SECURE_FILE_UPLOAD_CLEAR";
export const SECURE_FILE_UPLOAD_ERROR = "SECURE_FILE_UPLOAD_ERROR";
export const SECURE_FILE_UPLOAD_CHUNK = "SECURE_FILE_UPLOAD_CHUNK";
export const SECURE_FILE_START_CIPHERING = "SECURE_FILE_START_CIPHERING";
export interface SecureFileSetStorageInfoAction {
  type: typeof SECURE_FILE_SET_STORAGE_INFO;
  quota: SecureFilesQuota;
}
export const secureFileSetStorageInfoAction = (
  quota: SecureFilesQuota
): SecureFileSetStorageInfoAction => ({
  type: SECURE_FILE_SET_STORAGE_INFO,
  quota,
});
export interface SecureFileClearAction {
  type: typeof SECURE_FILE_CLEAR;
  downloadKey?: string;
}
export const secureFileClearAction = (
  downloadKey?: string
): SecureFileClearAction => ({
  type: SECURE_FILE_CLEAR,
  downloadKey,
});
export interface SecureFileStartDownloadAction {
  type: typeof SECURE_FILE_START_DOWNLOAD;
  downloadKey: string;
  contentLength: number;
}
export const secureFileStartDownloadAction = (
  downloadKey: string,
  contentLength: number
): SecureFileStartDownloadAction => ({
  type: SECURE_FILE_START_DOWNLOAD,
  downloadKey,
  contentLength,
});
export interface SecureFileDownloadChunkAction {
  type: typeof SECURE_FILE_DOWNLOAD_CHUNK;
  downloadKey: string;
  bytesReceived: number;
}
export const secureFileDownloadChunkAction = (
  downloadKey: string,
  bytesReceived: number
): SecureFileDownloadChunkAction => ({
  type: SECURE_FILE_DOWNLOAD_CHUNK,
  bytesReceived,
  downloadKey,
});
export interface SecureFileDownloadErrorAction {
  type: typeof SECURE_FILE_DOWNLOAD_ERROR;
  downloadKey: string;
}
export const secureFileDownloadErrorAction = (
  downloadKey: string
): SecureFileDownloadErrorAction => ({
  type: SECURE_FILE_DOWNLOAD_ERROR,
  downloadKey,
});
export interface SecureFileStartDecipheringAction {
  type: typeof SECURE_FILE_START_DECIPHERING;
  downloadKey: string;
}
export const secureFileStartDecipheringAction = (
  downloadKey: string
): SecureFileStartDecipheringAction => ({
  type: SECURE_FILE_START_DECIPHERING,
  downloadKey,
});
export interface SecureFileChunkReadyAction {
  type: typeof SECURE_FILE_CHUNK_READY;
  downloadKey: string;
  chunks?: string[];
}
export const secureFileChunkReadyAction = (
  downloadKey: string,
  chunks?: string[]
): SecureFileChunkReadyAction => ({
  type: SECURE_FILE_CHUNK_READY,
  downloadKey,
  chunks,
});
export interface SecureFileChunkTransferDoneAction {
  type: typeof SECURE_FILE_CHUNK_TRANSFER_DONE;
  downloadKey: string;
}
export const secureFileChunkTransferDoneAction = (
  downloadKey: string
): SecureFileChunkTransferDoneAction => ({
  type: SECURE_FILE_CHUNK_TRANSFER_DONE,
  downloadKey,
});
export interface SecureFileStartUploadAction {
  type: typeof SECURE_FILE_START_UPLOAD;
  contentLength: number;
}
export const secureFileStartUploadAction = (
  contentLength: number
): SecureFileStartUploadAction => ({
  type: SECURE_FILE_START_UPLOAD,
  contentLength,
});
export interface SecureFileUploadDoneAction {
  type: typeof SECURE_FILE_UPLOAD_DONE;
}
export const secureFileUploadDoneAction = (): SecureFileUploadDoneAction => ({
  type: SECURE_FILE_UPLOAD_DONE,
});
export interface SecureFileUploadClearAction {
  type: typeof SECURE_FILE_UPLOAD_CLEAR;
}
export const secureFileUploadClearAction = (): SecureFileUploadClearAction => ({
  type: SECURE_FILE_UPLOAD_CLEAR,
});
export interface SecureFileUploadChunkAction {
  type: typeof SECURE_FILE_UPLOAD_CHUNK;
  bytesSent: number;
}
export const secureFileUploadChunkAction = (
  bytesSent: number
): SecureFileUploadChunkAction => ({
  type: SECURE_FILE_UPLOAD_CHUNK,
  bytesSent,
});
export interface SecureFileUploadErrorAction {
  type: typeof SECURE_FILE_UPLOAD_ERROR;
}
export const secureFileUploadErrorAction = (): SecureFileUploadErrorAction => ({
  type: SECURE_FILE_UPLOAD_ERROR,
});
export interface SecureFileStartCipheringAction {
  type: typeof SECURE_FILE_START_CIPHERING;
}
export const secureFileStartCipheringAction =
  (): SecureFileStartCipheringAction => ({
    type: SECURE_FILE_START_CIPHERING,
  });
export type SecureFileAction =
  | SecureFileClearAction
  | SecureFileStartDownloadAction
  | SecureFileDownloadChunkAction
  | SecureFileSetStorageInfoAction
  | SecureFileStartDecipheringAction
  | SecureFileDownloadErrorAction
  | SecureFileStartUploadAction
  | SecureFileUploadDoneAction
  | SecureFileUploadClearAction
  | SecureFileUploadChunkAction
  | SecureFileStartCipheringAction
  | SecureFileUploadErrorAction
  | SecureFileChunkReadyAction
  | SecureFileChunkTransferDoneAction;
