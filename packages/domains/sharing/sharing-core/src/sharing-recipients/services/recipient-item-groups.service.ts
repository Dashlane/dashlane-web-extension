import { CarbonLegacyClient } from "@dashlane/communication";
import { combineLatestWith, from, map, Observable, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import {
  VaultItemsCrudClient,
  VaultItemType,
  VaultSearchClient,
} from "@dashlane/vault-contracts";
import { ItemGroupsGetterService } from "../../sharing-carbon-helpers";
@Injectable()
export class RecipientItemGroupsService {
  public constructor(
    private client: CarbonLegacyClient,
    private itemGroupGetter: ItemGroupsGetterService,
    private vaultItemsCrud: VaultItemsCrudClient,
    private vaultSearchClient: VaultSearchClient
  ) {}
  public getForSpaceId(
    spaceId: string | null
  ): Observable<ItemGroupDownload[]> {
    return this.itemGroupGetter.get().pipe(
      switchMap((itemGroupsResult) => {
        if (isFailure(itemGroupsResult)) {
          throw new Error("Unable to find items in item group");
        }
        const itemGroups = getSuccess(itemGroupsResult);
        const itemGroupItemIds = itemGroups.flatMap(
          (itemGroup) => (itemGroup.items || [])[0]?.itemId
        );
        const queryResult = this.vaultItemsCrud.queries.query({
          vaultItemTypes: [
            VaultItemType.Credential,
            VaultItemType.SecureNote,
            VaultItemType.Secret,
          ],
          ids: itemGroupItemIds,
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
      }),
      combineLatestWith(this.itemGroupGetter.get()),
      map(([itemsInSpaceResult, itemGroupsResult]) => {
        if (isFailure(itemsInSpaceResult) || isFailure(itemGroupsResult)) {
          throw new Error("Unable to find items in item group");
        }
        const vaultItems = getSuccess(itemsInSpaceResult);
        const itemGroups = getSuccess(itemGroupsResult);
        const vaultItemsInSpace = [
          ...vaultItems.credentialsResult.items,
          ...vaultItems.secureNotesResult.items,
          ...vaultItems.secretsResult.items,
        ];
        const filteredItemGroups = itemGroups.filter(
          (itemGroup: ItemGroupDownload) =>
            vaultItemsInSpace.some(
              (item) => item.id === (itemGroup.items || [])[0]?.itemId
            )
        );
        return filteredItemGroups;
      })
    );
  }
}
