import { map, switchMap } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import { isSuccess, success } from "@dashlane/framework-types";
import {
  GetUserSharedVaultItemsQuery,
  Status,
} from "@dashlane/sharing-contracts";
import { VaultItemType, VaultSearchClient } from "@dashlane/vault-contracts";
import { ItemGroupsGetterService } from "../../../sharing-carbon-helpers";
@QueryHandler(GetUserSharedVaultItemsQuery)
export class GetUserSharedVaultItemsQueryHandler
  implements IQueryHandler<GetUserSharedVaultItemsQuery>
{
  constructor(
    private vaultClient: VaultSearchClient,
    private itemGroupGetter: ItemGroupsGetterService
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
    const { userId, groupId, query, spaceId } = body;
    if (!userId && !groupId) {
      throw new Error("No userId and no groupId has been provided");
    }
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
