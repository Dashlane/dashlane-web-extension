import {
  FileDownloadStatus,
  SecureFileDownloadProgressView,
  SecureFileInfo,
  SecureFilesQuota,
  SecureFileUploadProgress,
} from "@dashlane/communication";
import { omit } from "ramda";
import { State } from "Store";
export const secureFileInfoSelector = (state: State): SecureFileInfo[] =>
  state.userSession.personalData.secureFileInfo;
export const secureFileDownloadSelector = (
  state: State,
  downloadKey: string
): SecureFileDownloadProgressView => {
  const progress =
    state.userSession.secureFileStorageState.downloads[downloadKey];
  if (!progress) {
    return null;
  }
  const chunkTransfer =
    progress?.status === FileDownloadStatus.ChunkReady
      ? { chunk: progress.chunks[progress.currentChunkIndex] }
      : {};
  const progressView: SecureFileDownloadProgressView = {
    ...omit(["chunks", "currentChunkIndex"], progress),
    ...chunkTransfer,
  } as SecureFileDownloadProgressView;
  return progressView;
};
export const secureFileUploadSelector = (
  state: State
): SecureFileUploadProgress => {
  return state.userSession.secureFileStorageState.upload;
};
export const getSecureFileDownloadSelector =
  (downloadKey: string) => (state: State) =>
    secureFileDownloadSelector(state, downloadKey);
export const secureFilesQuotaSelector = (state: State): SecureFilesQuota =>
  state.userSession.secureFileStorageState.quota;
