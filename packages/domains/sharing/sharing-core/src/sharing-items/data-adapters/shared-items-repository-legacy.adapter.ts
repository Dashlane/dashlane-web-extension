import { combineLatestWith, map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  isSuccess,
  Result,
  safeCast,
} from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
import { ItemGroupDownload, UserGroupDownload } from "@dashlane/server-sdk/v1";
import {
  SharedAccess,
  SharedCollection,
  SharedItem,
} from "@dashlane/sharing-contracts";
import {
  ItemGroupsGetterService,
  UserGroupsGetterService,
} from "../../sharing-carbon-helpers";
import { SharedItemsRepository } from "../handlers/common/shared-items-repository";
import { SharedCollectionsRepository } from "../../sharing-collections";
import { toSharedAccess, toSharedItem } from "./item-group-adapter";
const mapToSharedItems = (
  itemGroups: ItemGroupDownload[],
  allUserGroups: UserGroupDownload[],
  allCollections: SharedCollection[],
  userId: string
): SharedItem[] =>
  itemGroups.reduce((acc, value) => {
    if (value.type === "items") {
      try {
        const sharedItem: SharedItem = toSharedItem(
          value,
          allUserGroups,
          allCollections,
          userId
        );
        acc.push(sharedItem);
      } catch (error) {}
    }
    return acc;
  }, safeCast<SharedItem[]>([]));
const mapToSharedItem = (
  itemGroup: ItemGroupDownload | undefined,
  allUserGroups: UserGroupDownload[],
  allCollections: SharedCollection[],
  userId: string
) => {
  if (!itemGroup) {
    return null;
  }
  try {
    const sharedItem: SharedItem = toSharedItem(
      itemGroup,
      allUserGroups,
      allCollections,
      userId
    );
    return sharedItem;
  } catch (error) {
    return null;
  }
};
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
    return this.combineWithCollectionsAndUserGroups<
      ItemGroupDownload[],
      SharedItem[]
    >(this.itemGroupsGetter.get(), mapToSharedItems);
  }
  public sharedItemsForIds$(itemIds: string[]) {
    return this.combineWithCollectionsAndUserGroups(
      this.itemGroupsGetter.getForItemsIds(itemIds),
      mapToSharedItems
    );
  }
  public sharedItemForId$(itemId: string) {
    return this.combineWithCollectionsAndUserGroups(
      this.itemGroupsGetter.getForItemId(itemId),
      mapToSharedItem
    );
  }
  public sharedAccess$() {
    return this.itemGroupsGetter.get().pipe(
      map((itemGroups) => {
        if (isFailure(itemGroups)) {
          throw new Error(
            "Error when retrieving item groups for shared access"
          );
        }
        return getSuccess(itemGroups).map((itemGroup) =>
          toSharedAccess(itemGroup)
        );
      })
    );
  }
  public sharedAccessForId$(itemId: string) {
    return this.combineWithCollectionsAndUserGroups(
      this.itemGroupsGetter.getForItemId(itemId),
      (itemGroup) =>
        itemGroup
          ? { sharedItemId: itemGroup.groupId, ...toSharedAccess(itemGroup) }
          : null
    );
  }
  public sharedAccessForIds$(itemIds: string[]) {
    return this.itemGroupsGetter.getForItemsIds(itemIds).pipe(
      map((itemGroups) => {
        if (isFailure(itemGroups)) {
          throw new Error("Cannot get shared access for items");
        }
        return getSuccess(itemGroups).map((itemGroup) =>
          toSharedAccess(itemGroup)
        );
      })
    );
  }
  public sharedAccessesById$(itemIds: string[]) {
    return this.itemGroupsGetter.getForItemsIds(itemIds).pipe(
      map((itemGroups) => {
        if (isFailure(itemGroups)) {
          throw new Error("Cannot get shared access for items");
        }
        return getSuccess(itemGroups).reduce((acc, itemGroup) => {
          const itemId = itemGroup.items?.[0].itemId;
          if (itemId) {
            acc[itemId] = toSharedAccess(itemGroup);
          }
          return acc;
        }, safeCast<Record<string, SharedAccess>>({}));
      })
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
