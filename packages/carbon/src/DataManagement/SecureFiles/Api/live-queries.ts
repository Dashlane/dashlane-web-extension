import {
  SecureFileDownloadProgressView,
  SecureFilesQuota,
  SecureFileUploadProgress,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type SecureFileLiveQueries = {
  liveSecureFilesQuota: LiveQuery<void, SecureFilesQuota>;
  liveFileDownloadProgress: LiveQuery<string, SecureFileDownloadProgressView>;
  liveFileUploadProgress: LiveQuery<void, SecureFileUploadProgress>;
};
