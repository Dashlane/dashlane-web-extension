import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { SecureFilesCommands } from "DataManagement/SecureFiles/Api/commands";
import { addSecureFileHandler } from "DataManagement/SecureFiles/handlers/addSecureFileHandler";
import {
  secureFileDownloadSelector,
  secureFileInfoSelector,
  secureFilesQuotaSelector,
  secureFileUploadSelector,
} from "DataManagement/SecureFiles/selectors";
import { SecureFileInfoQueries } from "DataManagement/SecureFiles/Api/queries";
import { initSecureFilesStorageInfoHandler } from "DataManagement/SecureFiles/handlers/initSecureFilesStorageInfoHandler";
import { downloadSecureFileHandler } from "DataManagement/SecureFiles/handlers/downloadSecureFileHandler";
import { commitSecureFileHandler } from "DataManagement/SecureFiles/handlers/commitSecureFileHandler";
import { updateSecureFileQuotaHandler } from "DataManagement/SecureFiles/handlers/updateSecureFileQuotaHandler";
import { SecureFileLiveQueries } from "./live-queries";
import {
  getFileDownloadProgress$,
  getFileUploadProgress$,
  secureFilesQuota$,
} from "../live";
import { validateSecureFileHandler } from "../handlers/validateSecureFileHandler";
import { chunkTransferDoneHandler } from "../handlers/chunkTransferDoneHandler";
import { clearSecureFileStateHandler } from "../handlers/clearSecureFileStateHandler";
export const config: CommandQueryBusConfig<
  SecureFilesCommands,
  SecureFileInfoQueries,
  SecureFileLiveQueries
> = {
  commands: {
    downloadSecureFile: {
      handler: downloadSecureFileHandler,
    },
    updateSecureFileQuota: {
      handler: updateSecureFileQuotaHandler,
    },
    addSecureFile: {
      handler: addSecureFileHandler,
    },
    validateSecureFile: {
      handler: validateSecureFileHandler,
    },
    commitSecureFile: {
      handler: commitSecureFileHandler,
    },
    initSecureFilesStorageInfo: {
      handler: initSecureFilesStorageInfoHandler,
    },
    chunkTransferDone: {
      handler: chunkTransferDoneHandler,
    },
    clearSecureFileState: {
      handler: clearSecureFileStateHandler,
    },
  },
  queries: {
    getSecureFilesInfoList: {
      selector: secureFileInfoSelector,
    },
    getSecureFilesQuota: {
      selector: secureFilesQuotaSelector,
    },
    getFileDownloadProgress: {
      selector: secureFileDownloadSelector,
    },
    getFileUploadProgress: {
      selector: secureFileUploadSelector,
    },
  },
  liveQueries: {
    liveFileDownloadProgress: {
      operator: getFileDownloadProgress$,
    },
    liveFileUploadProgress: {
      operator: getFileUploadProgress$,
    },
    liveSecureFilesQuota: {
      operator: secureFilesQuota$,
    },
  },
};
