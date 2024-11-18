export const SECURE_FILE_CLEAR = "SECURE_FILE_CLEAR";
export const SECURE_FILE_START_UPLOAD = "SECURE_FILE_START_UPLOAD";
export const SECURE_FILE_UPLOAD_DONE = "SECURE_FILE_UPLOAD_DONE";
export const SECURE_FILE_UPLOAD_CLEAR = "SECURE_FILE_UPLOAD_CLEAR";
export const SECURE_FILE_UPLOAD_ERROR = "SECURE_FILE_UPLOAD_ERROR";
export const SECURE_FILE_UPLOAD_CHUNK = "SECURE_FILE_UPLOAD_CHUNK";
export const SECURE_FILE_START_CIPHERING = "SECURE_FILE_START_CIPHERING";
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
  | SecureFileStartUploadAction
  | SecureFileUploadDoneAction
  | SecureFileUploadClearAction
  | SecureFileUploadChunkAction
  | SecureFileStartCipheringAction
  | SecureFileUploadErrorAction;
