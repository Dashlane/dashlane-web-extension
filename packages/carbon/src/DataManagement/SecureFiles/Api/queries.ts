import {
  SecureFileDownloadProgressView,
  SecureFileInfo,
  SecureFilesQuota,
  SecureFileUploadProgress,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type SecureFileInfoQueries = {
  getSecureFilesQuota: Query<void, SecureFilesQuota>;
  getSecureFilesInfoList: Query<void, SecureFileInfo[]>;
  getFileDownloadProgress: Query<string, SecureFileDownloadProgressView>;
  getFileUploadProgress: Query<void, SecureFileUploadProgress>;
};
