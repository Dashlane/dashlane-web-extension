import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { SecureFilesCommands } from "DataManagement/SecureFiles/Api/commands";
import { addSecureFileHandler } from "DataManagement/SecureFiles/handlers/addSecureFileHandler";
import { secureFileUploadSelector } from "DataManagement/SecureFiles/selectors";
import { SecureFileInfoQueries } from "DataManagement/SecureFiles/Api/queries";
import { commitSecureFileHandler } from "DataManagement/SecureFiles/handlers/commitSecureFileHandler";
import { SecureFileLiveQueries } from "./live-queries";
import { getFileUploadProgress$ } from "../live";
import { validateSecureFileHandler } from "../handlers/validateSecureFileHandler";
import { clearSecureFileStateHandler } from "../handlers/clearSecureFileStateHandler";
export const config: CommandQueryBusConfig<
  SecureFilesCommands,
  SecureFileInfoQueries,
  SecureFileLiveQueries
> = {
  commands: {
    addSecureFile: {
      handler: addSecureFileHandler,
    },
    validateSecureFile: {
      handler: validateSecureFileHandler,
    },
    commitSecureFile: {
      handler: commitSecureFileHandler,
    },
    clearSecureFileState: {
      handler: clearSecureFileStateHandler,
    },
  },
  queries: {
    getFileUploadProgress: {
      selector: secureFileUploadSelector,
    },
  },
  liveQueries: {
    liveFileUploadProgress: {
      operator: getFileUploadProgress$,
    },
  },
};
