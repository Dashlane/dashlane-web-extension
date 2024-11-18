import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  DeleteSecureFileCommand,
  DownloadSecureFileCommand,
  FetchSecureFileQuotaCommand,
} from "./commands";
import { GetSecureFileQuotaQuery, SecureFileProgressQuery } from "./queries";
export const secureFilesApi = defineModuleApi({
  name: "secureFiles" as const,
  commands: {
    deleteSecureFile: DeleteSecureFileCommand,
    downloadSecureFile: DownloadSecureFileCommand,
    fetchSecureFileQuota: FetchSecureFileQuotaCommand,
  },
  events: {},
  queries: {
    secureFileProgress: SecureFileProgressQuery,
    getSecureFileQuota: GetSecureFileQuotaQuery,
  },
});
