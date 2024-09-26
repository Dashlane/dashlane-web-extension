export const UPDATE_AVAILABLE_HTTP_STATUS = "update_available";
export const NO_CURRENT_UPDATE_HTTP_STATUS = "unknown_revision";
export const FILE_NOT_FOUND_HTTP_STATUS = "not_found";
export const FILE_NOT_UPDATED = "not_updated";
export const UNSPECIFIED_ERROR = "unspecified_error";
export const SERVER_ERROR_HTTP_STATUS = "error_server";
export type FileMetaHTTPStatus =
  | typeof UPDATE_AVAILABLE_HTTP_STATUS
  | typeof NO_CURRENT_UPDATE_HTTP_STATUS
  | typeof FILE_NOT_FOUND_HTTP_STATUS
  | typeof FILE_NOT_UPDATED
  | typeof UNSPECIFIED_ERROR
  | typeof SERVER_ERROR_HTTP_STATUS;
export interface GetFileMetaDataResponse {
  status: FileMetaHTTPStatus;
}
export interface UpdateAvailableFileMetaData extends GetFileMetaDataResponse {
  status: typeof UPDATE_AVAILABLE_HTTP_STATUS;
  revision: number;
  signature?: string;
  key?: string;
  url: string;
}
export type DecipherRequest = {
  cipheredFileContent: ArrayBuffer;
  fileMetaData: UpdateAvailableFileMetaData;
};
export type DecipherResult = {
  decipheredFile: ArrayBuffer;
};
export const FileNamesList = ["phishing_urls_test.json"] as const;
export type FileNamesStorageKey = (typeof FileNamesList)[number];
export type RevisionNumber = number;
export type FileRevisionMapper = {
  files: Record<string, number>;
};
export type FileMetaDataState = Partial<FileRevisionMapper>;
