import { firstValueFrom } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { FetchSecureFileQuotaCommand } from "@dashlane/vault-contracts";
import { SecureFilesQuotaStore } from "../../stores/secure-file-quota.store";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
@CommandHandler(FetchSecureFileQuotaCommand)
export class FetchSecureFileQuotaCommandHandler
  implements ICommandHandler<FetchSecureFileQuotaCommand>
{
  constructor(
    private secureFilesQuotaStore: SecureFilesQuotaStore,
    private serverApiClient: ServerApiClient
  ) {}
  async execute(): CommandHandlerResponseOf<FetchSecureFileQuotaCommand> {
    const uploadLinkResult = await firstValueFrom(
      this.serverApiClient.v1.securefile.getUploadLink({
        contentLength: 0,
        secureFileInfoId: uuidv4(),
      })
    );
    if (isFailure(uploadLinkResult)) {
      throw new Error("Unabled to get quota data from server.");
    }
    const uploadData = getSuccess(uploadLinkResult).data;
    const { max, remaining } = uploadData.quota;
    await this.secureFilesQuotaStore.set({ max, remaining });
    return success(undefined);
  }
}
