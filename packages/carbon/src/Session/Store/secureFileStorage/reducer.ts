import { FileUploadStatus } from "@dashlane/communication";
import { SECURE_FILE_CLEAR, SECURE_FILE_UPLOAD_CLEAR } from ".";
import {
  SECURE_FILE_START_CIPHERING,
  SECURE_FILE_START_UPLOAD,
  SECURE_FILE_UPLOAD_CHUNK,
  SECURE_FILE_UPLOAD_DONE,
  SECURE_FILE_UPLOAD_ERROR,
  SecureFileAction,
} from "./actions";
import { SecureFileStorageState } from "./types";
const initialState: SecureFileStorageState = {
  upload: {
    status: FileUploadStatus.None,
    bytesSent: 0,
    contentLength: 0,
  },
};
export const SecureFileStorageReducer = (
  state: SecureFileStorageState = initialState,
  action: SecureFileAction
): SecureFileStorageState => {
  switch (action.type) {
    case SECURE_FILE_CLEAR: {
      return {
        ...state,
        upload: initialState.upload,
      };
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
