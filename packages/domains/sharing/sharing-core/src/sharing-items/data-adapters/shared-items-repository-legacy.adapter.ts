import { combineLatestWith, map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  Result,
} from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { UserGroupDownload } from "@dashlane/server-sdk/v1";
import { SharedCollection } from "@dashlane/sharing-contracts";
import {
  ItemGroupsGetterService,
  UserGroupsGetterService,
} from "../../sharing-carbon-helpers";
import { SharedItemsRepository } from "../handlers/common/shared-items-repository";
import { SharedCollectionsRepository } from "../../sharing-collections";
import { toSharedItem } from "./item-group-adapter";
@Injectable()
export class SharedItemsLegacyRepositoryAdapter
  implements SharedItemsRepository
{
  public constructor(
    private readonly itemGroupsGetter: ItemGroupsGetterService,
    private readonly userGroupsGetter: UserGroupsGetterService,
    private readonly collectionsRepository: SharedCollectionsRepository,
    private readonly carbonLegacyClient: CarbonLegacyClient
  ) {}
  private userId$() {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    return carbonState({
      path: "state.userSession.account.login",
    }).pipe(
      map((login) => {
        if (isSuccess(login) && typeof login.data === "string") {
          return login.data;
        }
        throw new Error("No active login");
      })
    );
  }
  private combineWithCollectionsAndUserGroups<T, R>(
    input: Observable<Result<T, unknown>>,
    mapFunction: (
      result: T,
      allUserGroups: UserGroupDownload[],
      allCollections: SharedCollection[],
      userId: string
    ) => R
  ): Observable<R> {
    return input.pipe(
      combineLatestWith(
        this.userGroupsGetter.getCarbonUserGroups$(),
        this.collectionsRepository.collections$(),
        this.userId$()
      ),
      map(([result, allUserGroups, allCollections, userId]) => {
        if (isFailure(result)) {
          throw new Error("Error when retrieving item groups");
        }
        return mapFunction(
          getSuccess(result),
          allUserGroups,
          allCollections,
          userId
        );
      })
    );
  }
  public sharedItems$() {
    return this.combineWithCollectionsAndUserGroups(
      this.itemGroupsGetter.get(),
      (itemGroups, allUserGroups, allCollections, userId) =>
        itemGroups.map((itemGroup) =>
          toSharedItem(itemGroup, allUserGroups, allCollections, userId)
        )
    );
  }
  public sharedItemsForIds$(itemIds: string[]) {
    return this.combineWithCollectionsAndUserGroups(
      this.itemGroupsGetter.getForItemsIds(itemIds),
      (itemGroups, allUserGroups, allCollections, userId) =>
        itemGroups.map((itemGroup) =>
          toSharedItem(itemGroup, allUserGroups, allCollections, userId)
        )
    );
  }
  public sharedItemForId$(itemId: string) {
    return this.combineWithCollectionsAndUserGroups(
      this.itemGroupsGetter.getForItemId(itemId),
      (itemGroup, allUserGroups, allCollections, userId) =>
        itemGroup
          ? toSharedItem(itemGroup, allUserGroups, allCollections, userId)
          : null
    );
  }
  public getSharedItemsIndex() {
    return Promise.reject(new Error("not supported"));
  }
  public getVaultItemsIndex() {
    return Promise.reject(new Error("not supported"));
  }
  public async setSharedItems() {
    throw new Error("not supported");
  }
}
