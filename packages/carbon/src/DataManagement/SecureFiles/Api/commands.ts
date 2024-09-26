import type {
  AddSecureFileRequest,
  AddSecureFileResult,
  CommitSecureFileRequest,
  CommitSecureFileResult,
  DownloadSecureFileRequest,
  DownloadSecureFileResult,
  InitSecureFilesStorageInfoResult,
  UpdateSecureFileQuotaRequest,
  UpdateSecureFileQuotaResult,
  ValidateSecureFileRequest,
  ValidateSecureFileResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SecureFilesCommands = {
  downloadSecureFile: Command<
    DownloadSecureFileRequest,
    DownloadSecureFileResult
  >;
  chunkTransferDone: Command<string, void>;
  addSecureFile: Command<AddSecureFileRequest, AddSecureFileResult>;
  updateSecureFileQuota: Command<
    UpdateSecureFileQuotaRequest,
    UpdateSecureFileQuotaResult
  >;
  validateSecureFile: Command<
    ValidateSecureFileRequest,
    ValidateSecureFileResult
  >;
  commitSecureFile: Command<CommitSecureFileRequest, CommitSecureFileResult>;
  initSecureFilesStorageInfo: Command<void, InitSecureFilesStorageInfoResult>;
  clearSecureFileState: Command<string | undefined, void>;
};
