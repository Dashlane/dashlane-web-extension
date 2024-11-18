import {
  FileDownloadStatus,
  FileUploadStatus,
  SecureFileDownloadProgress,
} from "@dashlane/communication";
import {
  SECURE_FILE_CHUNK_READY,
  SECURE_FILE_CHUNK_TRANSFER_DONE,
  SECURE_FILE_CLEAR,
  SECURE_FILE_UPLOAD_CLEAR,
} from ".";
import {
  SECURE_FILE_DOWNLOAD_CHUNK,
  SECURE_FILE_DOWNLOAD_ERROR,
  SECURE_FILE_SET_STORAGE_INFO,
  SECURE_FILE_START_CIPHERING,
  SECURE_FILE_START_DECIPHERING,
  SECURE_FILE_START_DOWNLOAD,
  SECURE_FILE_START_UPLOAD,
  SECURE_FILE_UPLOAD_CHUNK,
  SECURE_FILE_UPLOAD_DONE,
  SECURE_FILE_UPLOAD_ERROR,
  SecureFileAction,
} from "./actions";
import { SecureFileStorageState } from "./types";
import { shallowEqual } from "shallow-equal";
const updateDownload = (
  state: SecureFileStorageState,
  downloadKey: string,
  update: Partial<SecureFileDownloadProgress>
) => {
  const updatedDownload = {
    [downloadKey]: {
      ...update,
    },
  };
  return {
    ...state,
    downloads: {
      ...updatedDownload,
    },
  } as SecureFileStorageState;
};
const initialState: SecureFileStorageState = {
  downloads: {},
  upload: {
    status: FileUploadStatus.None,
    bytesSent: 0,
    contentLength: 0,
  },
  quota: { max: 0, remaining: 0 },
};
export const SecureFileStorageReducer = (
  state: SecureFileStorageState = initialState,
  action: SecureFileAction
): SecureFileStorageState => {
  switch (action.type) {
    case SECURE_FILE_SET_STORAGE_INFO: {
      return shallowEqual(action.quota, state.quota)
        ? state
        : { ...state, quota: action.quota };
    }
    case SECURE_FILE_CLEAR: {
      const download = action.downloadKey
        ? state.downloads[action.downloadKey]
        : undefined;
      const downloads = download
        ? { ...state.downloads, [action.downloadKey]: undefined }
        : initialState.downloads;
      return {
        ...state,
        downloads,
        upload: initialState.upload,
      };
    }
    case SECURE_FILE_START_DOWNLOAD:
      return updateDownload(state, action.downloadKey, {
        status: FileDownloadStatus.Initial,
        contentLength: action.contentLength,
        bytesReceived: 0,
      });
    case SECURE_FILE_DOWNLOAD_CHUNK: {
      const download = state.downloads[action.downloadKey];
      if (!download) {
        return state;
      }
      const bytesReceived =
        download.status === FileDownloadStatus.Downloading
          ? download.bytesReceived
          : 0;
      const contentLength =
        download.status === FileDownloadStatus.Downloading ||
        download.status === FileDownloadStatus.Initial
          ? download.contentLength
          : 0;
      return updateDownload(state, action.downloadKey, {
        status: FileDownloadStatus.Downloading,
        bytesReceived: bytesReceived + action.bytesReceived,
        contentLength,
      });
    }
    case SECURE_FILE_START_DECIPHERING: {
      const download = state.downloads[action.downloadKey];
      if (!download) {
        return state;
      }
      return updateDownload(state, action.downloadKey, {
        status: FileDownloadStatus.Deciphering,
      });
    }
    case SECURE_FILE_DOWNLOAD_ERROR:
      return updateDownload(state, action.downloadKey, {
        status: FileDownloadStatus.Error,
      });
    case SECURE_FILE_CHUNK_READY: {
      const download = state.downloads[action.downloadKey];
      if (!download) {
        return state;
      }
      const { chunks, currentChunkIndex } =
        download?.status === FileDownloadStatus.ChunkReady
          ? {
              chunks: download.chunks,
              currentChunkIndex: download.currentChunkIndex + 1,
            }
          : { chunks: action.chunks, currentChunkIndex: 0 };
      return updateDownload(
        state,
        action.downloadKey,
        currentChunkIndex === chunks.length
          ? {
              status: FileDownloadStatus.TransferComplete,
            }
          : {
              status: FileDownloadStatus.ChunkReady,
              currentChunkIndex,
              chunks,
            }
      );
    }
    case SECURE_FILE_CHUNK_TRANSFER_DONE: {
      const download = state.downloads[action.downloadKey];
      if (!download) {
        return state;
      }
      const chunks =
        download?.status === FileDownloadStatus.ChunkReady
          ? download.chunks
          : undefined;
      return updateDownload(state, action.downloadKey, {
        status: FileDownloadStatus.ChunkDownloaded,
        chunks,
      });
    }
    case SECURE_FILE_START_UPLOAD:
      return {
        ...state,
        upload: {
          ...state.upload,
          status: FileUploadStatus.Initial,
          contentLength: action.contentLength,
          bytesSent: 0,
        },
      };
    case SECURE_FILE_UPLOAD_CHUNK: {
      const upload = state.upload;
      if (upload.contentLength === 0) {
        return state;
      }
      const bytesSent = upload.bytesSent + action.bytesSent;
      return {
        ...state,
        upload: {
          ...state.upload,
          status: FileUploadStatus.Uploading,
          bytesSent:
            bytesSent < upload.contentLength ? bytesSent : upload.bytesSent,
        },
      };
    }
    case SECURE_FILE_START_CIPHERING:
      return {
        ...state,
        upload: {
          ...state.upload,
          status: FileUploadStatus.Ciphering,
        },
      };
    case SECURE_FILE_UPLOAD_ERROR:
      return {
        ...state,
        upload: {
          ...state.upload,
          status: FileUploadStatus.Error,
        },
      };
    case SECURE_FILE_UPLOAD_DONE:
      if (state.upload.contentLength === 0) {
        return state;
      }
      return {
        ...state,
        upload: {
          bytesSent: 0,
          contentLength: 0,
          status: FileUploadStatus.Done,
        },
      };
    case SECURE_FILE_UPLOAD_CLEAR:
      return {
        ...state,
        upload: {
          bytesSent: 0,
          contentLength: 0,
          status: FileUploadStatus.None,
        },
      };
    default:
      return state;
  }
};
export const getEmptySecureFileStorageState = () => initialState;
