import { CarbonLegacyClient } from "@dashlane/communication";
import { Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { mapSuccessObservable, Result } from "@dashlane/framework-types";
import { ItemGroupDownload } from "@dashlane/server-sdk/v1";
import { ItemGroupDownload as CarbonItemGroupDownload } from "@dashlane/sharing";
import { convertCarbonItemGroupDownload } from "../utils/convert-carbon-itemgroupdownload";
@Injectable()
export class ItemGroupsGetterService {
  public constructor(private client: CarbonLegacyClient) {}
  public get() {
    const {
      queries: { carbonState },
    } = this.client;
    return carbonState({
      path: "userSession.sharingData.itemGroups",
    }).pipe(
      mapSuccessObservable((groups) =>
        (groups as CarbonItemGroupDownload[]).map(
          convertCarbonItemGroupDownload
        )
      )
    );
  }
  public getForItemId(
    itemId: string
  ): Observable<Result<ItemGroupDownload | undefined>> {
    return this.get().pipe(
      mapSuccessObservable((groups) =>
        groups.find((itemGroup) =>
          itemGroup.items?.some((item) => itemId === item.itemId)
        )
      )
    );
  }
  public getForItemGroupId(
    itemGroupId: string
  ): Observable<Result<ItemGroupDownload | undefined>> {
    return this.get().pipe(
      mapSuccessObservable((groups) =>
        groups.find((itemGroup) => itemGroup.groupId === itemGroupId)
      )
    );
  }
  public getForItemsIds(
    itemIds: string[]
  ): Observable<Result<ItemGroupDownload[]>> {
    return this.get().pipe(
      mapSuccessObservable((groups) =>
        groups.filter((itemGroup) =>
          itemGroup.items?.some((item) => itemIds.includes(item.itemId))
        )
      )
    );
  }
  public getForCollectionId(
    collectionIds: string
  ): Observable<Result<ItemGroupDownload[]>> {
    return this.get().pipe(
      mapSuccessObservable((groups) =>
        groups.filter((itemGroup) =>
          itemGroup.collections?.some((collection) =>
            collectionIds.includes(collection.uuid)
          )
        )
      )
    );
  }
}
