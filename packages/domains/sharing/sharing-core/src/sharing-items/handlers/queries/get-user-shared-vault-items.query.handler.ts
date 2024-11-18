import { map, switchMap, take } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { getSuccess, isSuccess, success } from "@dashlane/framework-types";
import {
  GetUserSharedVaultItemsParam,
  GetUserSharedVaultItemsQuery,
  Status,
} from "@dashlane/sharing-contracts";
import { VaultItemType, VaultSearchClient } from "@dashlane/vault-contracts";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
import { SharedItemsStore } from "../../store/shared-items.store";
@QueryHandler(GetUserSharedVaultItemsQuery)
export class GetUserSharedVaultItemsQueryHandler
  implements IQueryHandler<GetUserSharedVaultItemsQuery>
{
  constructor(
    private readonly vaultClient: VaultSearchClient,
    private readonly itemGroupGetter: ItemGroupsGetterService,
    private readonly featureFlips: FeatureFlipsClient,
    private readonly sharedItemsStore: SharedItemsStore
  ) {}
  private getVaultItems(
    vaultItemTypes: VaultItemType[],
    ids: string[],
    query: string,
    spaceId: string | null
  ) {
    return this.vaultClient.queries.search({
      searchQuery: query,
      vaultItemTypes,
      propertyFilters:
        spaceId !== null
          ? [
              {
                property: "spaceId",
                value: spaceId,
              },
            ]
          : undefined,
      ids,
    });
  }
  execute({ body }: GetUserSharedVaultItemsQuery) {
    const { userFeatureFlip } = this.featureFlips.queries;
    if (!body.userId && !body.groupId) {
      throw new Error("No userId and no groupId has been provided");
    }
    return userFeatureFlip({
      featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
    }).pipe(
      take(1),
      switchMap((isNewSharingSyncEnabledResult) => {
        const isNewSharingSyncEnabled = isSuccess(isNewSharingSyncEnabledResult)
          ? !!getSuccess(isNewSharingSyncEnabledResult)
          : false;
        return isNewSharingSyncEnabled
          ? this.executeWithGrapheneState$(body)
          : this.executeWithCarbonState$(body);
      })
    );
  }
  executeWithGrapheneState$(body: GetUserSharedVaultItemsParam) {
    const { userId, groupId, query, spaceId } = body;
    return this.sharedItemsStore.state$.pipe(
      switchMap(({ sharedAccess, sharedItems }) => {
        const allSharedIds = [];
        for (const sharedAccessId in sharedAccess) {
          if (userId) {
            if (
              sharedAccess[sharedAccessId].users.some(
                (user) => user.id === userId
              )
            ) {
              allSharedIds.push(sharedItems[sharedAccessId].itemId);
            }
          } else if (groupId) {
            if (
              sharedAccess[sharedAccessId].userGroups.some(
                (group) =>
                  group.id === groupId && group.status !== Status.Revoked
              )
            ) {
              allSharedIds.push(sharedItems[sharedAccessId].itemId);
            }
          }
        }
        return this.getVaultItems(
          [
            VaultItemType.Credential,
            VaultItemType.SecureNote,
            VaultItemType.Secret,
          ],
          allSharedIds,
          query,
          spaceId
        ).pipe(
          map((sharedVaultItemsData) => {
            if (!isSuccess(sharedVaultItemsData)) {
              throw new Error("Unable to retrieve vault items");
            }
            const sharedCredentials =
              sharedVaultItemsData.data.credentialsResult.items;
            const sharedSecureNotes =
              sharedVaultItemsData.data.secureNotesResult.items;
            const sharedSecrets = sharedVaultItemsData.data.secretsResult.items;
            return success({
              sharedCredentials,
              sharedSecureNotes,
              sharedSecrets,
            });
          })
        );
      })
    );
  }
  executeWithCarbonState$(body: GetUserSharedVaultItemsParam) {
    const { userId, groupId, query, spaceId } = body;
    return this.itemGroupGetter.get().pipe(
      switchMap((sharingDataResult) => {
        if (!isSuccess(sharingDataResult)) {
          throw new Error("Incorrect type");
        }
        const sharingDataForUser = sharingDataResult.data.filter(
          (itemGroup) => {
            if (userId) {
              return itemGroup.users?.filter((user) => user.userId === userId)
                .length;
            } else if (groupId) {
              return itemGroup.groups?.filter(
                (group) =>
                  group.groupId === groupId && group.status !== Status.Revoked
              ).length;
            }
          }
        );
        const allSharedIds = sharingDataForUser.flatMap(
          (item) => item.items?.map((allId) => allId.itemId) || []
        );
        return this.getVaultItems(
          [
            VaultItemType.Credential,
            VaultItemType.SecureNote,
            VaultItemType.Secret,
          ],
          allSharedIds,
          query,
          spaceId
        ).pipe(
          map((sharedVaultItemsData) => {
            if (!isSuccess(sharedVaultItemsData)) {
              throw new Error("Unable to retrieve vault items");
            }
            const sharedCredentials =
              sharedVaultItemsData.data.credentialsResult.items;
            const sharedSecureNotes =
              sharedVaultItemsData.data.secureNotesResult.items;
            const sharedSecrets = sharedVaultItemsData.data.secretsResult.items;
            return success({
              sharedCredentials,
              sharedSecureNotes,
              sharedSecrets,
            });
          })
        );
      })
    );
  }
}
