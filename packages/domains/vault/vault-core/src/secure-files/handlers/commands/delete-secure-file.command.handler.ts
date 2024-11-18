import { firstValueFrom } from "rxjs";
import {
  type CarbonCommandError,
  CarbonLegacyClient,
  RemovePersonalDataItemFailureReason,
} from "@dashlane/communication";
import {
  CommandHandler,
  type CommandHandlerResponseOf,
  type ICommandHandler,
} from "@dashlane/framework-application";
import {
  regroupNetworkErrors,
  ServerApiClient,
} from "@dashlane/framework-dashlane-application";
import {
  failure,
  getFailure,
  getSuccess,
  isSuccess,
  match,
  success,
} from "@dashlane/framework-types";
import {
  createNoRemoteFileError,
  DeleteSecureFileCommand,
} from "@dashlane/vault-contracts";
import { SecureFilesQuotaStore } from "../../stores/secure-file-quota.store";
const getCarbonErrorReason = (x: CarbonCommandError) => {
  return !!x.error &&
    typeof x.error === "object" &&
    "reason" in x.error &&
    typeof x.error.reason === "number"
    ? (x.error.reason as number)
    : null;
};
@CommandHandler(DeleteSecureFileCommand)
export class DeleteSecureFileCommandHandler
  implements ICommandHandler<DeleteSecureFileCommand>
{
  constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private serverApiClient: ServerApiClient,
    private secureFilesQuotaStore: SecureFilesQuotaStore
  ) {}
  async execute({
    body,
  }: DeleteSecureFileCommand): CommandHandlerResponseOf<DeleteSecureFileCommand> {
    try {
      const carbonRemovalResult =
        await this.carbonLegacyClient.commands.carbonLegacyLeeloo({
          name: "removePersonalDataItem",
          arg: [
            {
              id: body.id,
            },
          ],
        });
      if (!isSuccess(carbonRemovalResult)) {
        const carbonRemovalFailure = getFailure(carbonRemovalResult);
        const carbonRemovalErrorReason =
          getCarbonErrorReason(carbonRemovalFailure);
        if (
          carbonRemovalErrorReason !==
          RemovePersonalDataItemFailureReason.NOT_FOUND
        ) {
          throw new Error(
            "Unexpected failure while attemping to delete personal data item in Carbon",
            {
              cause: {
                failure: carbonRemovalFailure,
                reason: carbonRemovalErrorReason,
                id: body.id,
              },
            }
          );
        }
      }
    } catch (err) {
      throw new Error(
        "Unexpectedly unable to attempt deleting personal data item in Carbon",
        { cause: err }
      );
    }
    const serverResult = await firstValueFrom(
      this.serverApiClient.v1.securefile.deleteSecureFile({
        secureFileInfoId: body.id,
      })
    );
    if (!isSuccess(serverResult)) {
      return match(serverResult.error, {
        ...regroupNetworkErrors((err) => {
          throw new Error(
            "Unexpected server error while attempting to delete remote secure file",
            { cause: err }
          );
        }),
        BusinessError: () => failure(createNoRemoteFileError()),
      });
    }
    const { quota: updatedSecureFileQuota } = getSuccess(serverResult).data;
    await this.secureFilesQuotaStore.set(updatedSecureFileQuota);
    return success(undefined);
  }
}
