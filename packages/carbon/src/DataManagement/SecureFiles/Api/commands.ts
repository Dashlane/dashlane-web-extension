import type {
  AddSecureFileRequest,
  AddSecureFileResult,
  CommitSecureFileRequest,
  CommitSecureFileResult,
  ValidateSecureFileRequest,
  ValidateSecureFileResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SecureFilesCommands = {
  addSecureFile: Command<AddSecureFileRequest, AddSecureFileResult>;
  validateSecureFile: Command<
    ValidateSecureFileRequest,
    ValidateSecureFileResult
  >;
  commitSecureFile: Command<CommitSecureFileRequest, CommitSecureFileResult>;
  clearSecureFileState: Command<string | undefined, void>;
};
