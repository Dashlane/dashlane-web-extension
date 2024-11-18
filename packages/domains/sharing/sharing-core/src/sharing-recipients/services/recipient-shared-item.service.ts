import { from, Observable, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { getSuccess, isFailure, Result } from "@dashlane/framework-types";
import {
  VaultItemsCrudClient,
  VaultItemsQueryResult,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { SharingItemsClient } from "@dashlane/sharing-contracts";
@Injectable()
export class RecipientSharedItemService {
  public constructor(
    private vaultItemsCrud: VaultItemsCrudClient,
    private readonly sharingItemsClient: SharingItemsClient
  ) {}
  public getSharedVaultItemsForSpaceId(
    spaceId: string | null
  ): Observable<Result<VaultItemsQueryResult>> {
    return this.sharingItemsClient.queries.getSharedItems().pipe(
      switchMap((sharedItemsResult) => {
        if (isFailure(sharedItemsResult)) {
          throw new Error("Unable to find items in item group");
        }
        const sharedItems = getSuccess(sharedItemsResult).sharedItems;
        const sharedItemIds = sharedItems.map(
          (sharedItem) => sharedItem.itemId
        );
        const queryResult = this.vaultItemsCrud.queries.query({
          vaultItemTypes: [
            VaultItemType.Credential,
            VaultItemType.SecureNote,
            VaultItemType.Secret,
          ],
          ids: sharedItemIds,
          propertyFilters:
            spaceId !== null
              ? [
                  {
                    property: "spaceId",
                    value: spaceId,
                  },
                ]
              : undefined,
        });
        return from(queryResult);
      })
    );
  }
}
