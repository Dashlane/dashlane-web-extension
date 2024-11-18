import { firstValueFrom, map } from "rxjs";
import {
  CommandHandler,
  type ICommandHandler,
} from "@dashlane/framework-application";
import { isFailure, isSuccess, success } from "@dashlane/framework-types";
import {
  RecipientTypes,
  RevokeSharedItemCommand,
  RevokeSharedItemCommandParam,
} from "@dashlane/sharing-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { VaultItemsCrudClient, VaultItemType } from "@dashlane/vault-contracts";
import { SharingSyncService } from "../../../sharing-common";
import {
  ITEM_GROUP_MEMBER_INVALID_REVISION,
  SharingCommonGateway,
} from "../../../sharing-common/services/sharing.gateway";
import { SharedItemsRepository } from "../common/shared-items-repository";
@CommandHandler(RevokeSharedItemCommand)
export class RevokeSharedItemCommandHandler
  implements ICommandHandler<RevokeSharedItemCommand>
{
  constructor(
    private readonly sharingSync: SharingSyncService,
    private readonly commonGateway: SharingCommonGateway,
    private readonly sharedItemRepository: SharedItemsRepository,
    private readonly vaultItemsCrudClient: VaultItemsCrudClient
  ) {}
  async execute({ body }: RevokeSharedItemCommand) {
    const { revision, itemGroupId, userLogins, userGroupIds } =
      await this.getItemGroup(body);
    const credential = await firstValueFrom(
      this.vaultItemsCrudClient.queries
        .query({
          vaultItemTypes: [VaultItemType.Credential],
          ids: [body.vaultItemId],
        })
        .pipe(
          map((dataResult) => {
            if (isSuccess(dataResult)) {
              return dataResult.data.credentialsResult.items.find(
                (credentialResult) => credentialResult.id === body.vaultItemId
              );
            }
          })
        )
    );
    const result = await this.commonGateway.revokeItemGroupMembers({
      revision,
      itemGroupId,
      userLogins,
      userGroupIds,
      auditLogDetails: credential
        ? {
            type: "AUTHENTIFIANT",
            domain: new ParsedURL(credential.URL).getRootDomain(),
            captureLog: true,
          }
        : undefined,
    });
    if (isFailure(result)) {
      if (result.error.tag === ITEM_GROUP_MEMBER_INVALID_REVISION) {
        await this.sharingSync.scheduleSync();
        const { revision: revisionRetry, itemGroupId: groupIdRetry } =
          await this.getItemGroup(body);
        await this.commonGateway.revokeItemGroupMembers({
          revision: revisionRetry,
          itemGroupId: groupIdRetry,
          userLogins,
          userGroupIds,
        });
        return success(undefined);
      } else {
        throw new Error("Revoke shared item failed after retry attempt");
      }
    }
    await this.sharingSync.scheduleSync();
    return success(undefined);
  }
  private async getItemGroup(body: RevokeSharedItemCommandParam) {
    const { vaultItemId, recipient } = body;
    const sharedItem = await firstValueFrom(
      this.sharedItemRepository.sharedItemForId$(vaultItemId)
    );
    if (!sharedItem) {
      throw new Error(`Failed to retrieve item group to revoke share item`);
    }
    const { sharedItemId, revision } = sharedItem;
    const userLogins =
      recipient.type === RecipientTypes.User ? [recipient.alias] : undefined;
    const userGroupIds =
      recipient.type === RecipientTypes.Group ? [recipient.groupId] : undefined;
    return {
      revision,
      itemGroupId: sharedItemId,
      userLogins,
      userGroupIds,
    };
  }
}
