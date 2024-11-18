import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import {
  AddSecureFileRequest,
  AddSecureFileResult,
  CommitSecureFileRequest,
  CommitSecureFileResult,
  SecureFileUploadProgress,
  ValidateSecureFileRequest,
  ValidateSecureFileResult,
} from "./types";
export const secureFilesQueriesSlots = {
  getFileUploadProgress: slot<void, SecureFileUploadProgress>(),
};
export const secureFilesLiveQueriesSlots = {
  liveFileUploadProgress: liveSlot<SecureFileUploadProgress>(),
};
export const secureFilesCommandsSlots = {
  addSecureFile: slot<AddSecureFileRequest, AddSecureFileResult>(),
  validateSecureFile: slot<
    ValidateSecureFileRequest,
    ValidateSecureFileResult
  >(),
  commitSecureFile: slot<CommitSecureFileRequest, CommitSecureFileResult>(),
  clearSecureFileState: slot<string | undefined, void>(),
};
