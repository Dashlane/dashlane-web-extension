import {
  SecureFileDownloadProgress,
  SecureFilesQuota,
  SecureFileUploadProgress,
} from "@dashlane/communication";
export type SecureFileDownload = Record<string, SecureFileDownloadProgress>;
export interface SecureFileStorageState {
  downloads: SecureFileDownload;
  quota: SecureFilesQuota;
  upload: SecureFileUploadProgress;
}
