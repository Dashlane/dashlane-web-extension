import {
  FileDownloadModule,
  HttpModule,
  Module,
} from "@dashlane/framework-application";
import {
  CryptographyModule,
  WebServicesModule,
} from "@dashlane/framework-dashlane-application";
import { secureFilesApi, SecureFilesFlips } from "@dashlane/vault-contracts";
import {
  DeleteSecureFileCommandHandler,
  DownloadSecureFileCommandHandler,
  FetchSecureFileQuotaCommandHandler,
  GetSecureFileQuotaQueryHandler,
  SecureFileProgressQueryHandler,
} from "./handlers";
import { SecureFilesProgressStore, SecureFilesQuotaStore } from "./stores";
@Module({
  api: secureFilesApi,
  imports: [
    HttpModule,
    WebServicesModule,
    CryptographyModule,
    FileDownloadModule,
  ],
  providers: [],
  handlers: {
    commands: {
      deleteSecureFile: DeleteSecureFileCommandHandler,
      downloadSecureFile: DownloadSecureFileCommandHandler,
      fetchSecureFileQuota: FetchSecureFileQuotaCommandHandler,
    },
    events: {},
    queries: {
      secureFileProgress: SecureFileProgressQueryHandler,
      getSecureFileQuota: GetSecureFileQuotaQueryHandler,
    },
  },
  stores: [SecureFilesProgressStore, SecureFilesQuotaStore],
  domainName: "vault",
  requiredFeatureFlips: [SecureFilesFlips.SecureFilesMigration],
})
export class SecureFilesModule {}
