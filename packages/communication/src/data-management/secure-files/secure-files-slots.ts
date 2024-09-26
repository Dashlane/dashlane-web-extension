import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import { SecureFileInfo } from "../../DataModel";
import {
  AddSecureFileRequest,
  AddSecureFileResult,
  CommitSecureFileRequest,
  CommitSecureFileResult,
  DownloadSecureFileRequest,
  DownloadSecureFileResult,
  InitSecureFilesStorageInfoResult,
  SecureFileDownloadProgressView,
  SecureFilesQuota,
  SecureFileUploadProgress,
  UpdateSecureFileQuotaRequest,
  UpdateSecureFileQuotaResult,
  ValidateSecureFileRequest,
  ValidateSecureFileResult,
} from "./types";
export const secureFilesQueriesSlots = {
  getSecureFilesQuota: slot<void, SecureFilesQuota>(),
  getSecureFilesInfoList: slot<void, SecureFileInfo[]>(),
  getFileDownloadProgress: slot<string, SecureFileDownloadProgressView>(),
  getFileUploadProgress: slot<void, SecureFileUploadProgress>(),
};
export const secureFilesLiveQueriesSlots = {
  liveSecureFilesQuota: liveSlot<SecureFilesQuota>(),
  liveFileDownloadProgress: liveSlot<SecureFileDownloadProgressView>(),
  liveFileUploadProgress: liveSlot<SecureFileUploadProgress>(),
};
export const secureFilesCommandsSlots = {
  downloadSecureFile: slot<
    DownloadSecureFileRequest,
    DownloadSecureFileResult
  >(),
  chunkTransferDone: slot<string, void>(),
  updateSecureFileQuota: slot<
    UpdateSecureFileQuotaRequest,
    UpdateSecureFileQuotaResult
  >(),
  addSecureFile: slot<AddSecureFileRequest, AddSecureFileResult>(),
  validateSecureFile: slot<
    ValidateSecureFileRequest,
    ValidateSecureFileResult
  >(),
  commitSecureFile: slot<CommitSecureFileRequest, CommitSecureFileResult>(),
  initSecureFilesStorageInfo: slot<void, InitSecureFilesStorageInfoResult>(),
  clearSecureFileState: slot<string | undefined, void>(),
};
