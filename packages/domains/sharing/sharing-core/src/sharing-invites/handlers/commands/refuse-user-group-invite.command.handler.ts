import { firstValueFrom, tap } from "rxjs";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  getRefuseUserGroupInviteFunctionalError,
  RefuseUserGroupInviteCommand,
} from "@dashlane/sharing-contracts";
import {
  isSuccess,
  mapFailureObservable,
  mapSuccessResultObservable,
  success,
} from "@dashlane/framework-types";
import { ProvisioningMethod } from "@dashlane/server-sdk/v1";
import { SharingSyncService } from "../../../sharing-common";
import { SharingUserGroupsRepository } from "../../../sharing-recipients/services/user-groups.repository";
@CommandHandler(RefuseUserGroupInviteCommand)
export class RefuseUserGroupInviteCommandHandler
  implements ICommandHandler<RefuseUserGroupInviteCommand>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private userGroupsRepository: SharingUserGroupsRepository,
    private sharingSync: SharingSyncService
  ) {}
  async execute(
    command: RefuseUserGroupInviteCommand
  ): CommandHandlerResponseOf<RefuseUserGroupInviteCommand> {
    const {
      body: { userGroupId },
    } = command;
    const userGroup = await this.userGroupsRepository.getUserGroupForId(
      userGroupId
    );
    const { groupId, revision } = userGroup;
    return await firstValueFrom(
      this.serverApiClient.v1.sharingUserdevice
        .refuseUserGroup({
          groupId,
          revision,
          provisioningMethod: ProvisioningMethod.USER,
        })
        .pipe(
          mapFailureObservable((response) => {
            if (response.tag === "BusinessError") {
              return getRefuseUserGroupInviteFunctionalError(response.code);
            }
            throw new Error(response.message);
          }),
          mapSuccessResultObservable((response) => {
            if (
              response.data.userGroupErrors === undefined ||
              response.data.userGroupErrors.length === 0
            ) {
              return success(undefined);
            }
            if (response.data.userGroupErrors.length > 0) {
              throw new Error(
                `Error for user group ${response.data.userGroupErrors[0].groupId}: ${response.data.userGroupErrors[0].message}`
              );
            }
            throw new Error("Unknown server error");
          }),
          tap(async (data) => {
            if (isSuccess(data)) {
              await this.sharingSync.scheduleSync();
            }
          })
        )
    );
  }
}
