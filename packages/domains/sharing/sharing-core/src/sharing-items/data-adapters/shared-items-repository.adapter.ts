import { map } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import { SharedItemsRepository } from "../handlers/common/shared-items-repository";
import {
  SharedItemsState,
  SharedItemsStore,
} from "../store/shared-items.store";
import { SharedItem } from "@dashlane/sharing-contracts";
@Injectable()
export class SharedItemsRepositoryAdapter implements SharedItemsRepository {
  public constructor(private readonly store: SharedItemsStore) {}
  public async getVaultItemsIndex() {
    const { indexPerVaultItemId } = await this.store.getState();
    return indexPerVaultItemId;
  }
  public async getSharedItemsIndex() {
    const { sharedItems } = await this.store.getState();
    return sharedItems;
  }
  public async setSharedItems(
    sharedItems: {
      sharedItem: SharedItem;
      revision: number;
    }[]
  ) {
    await this.store.set(
      sharedItems.reduce((state, { sharedItem, revision }) => {
        state.sharedItems[sharedItem.sharedItemId] = sharedItem;
        state.indexPerVaultItemId[sharedItem.itemId] = {
          id: sharedItem.sharedItemId,
          revision,
        };
        return state;
      }, safeCast<SharedItemsState>({ sharedItems: {}, indexPerVaultItemId: {} }))
    );
  }
  public sharedItems$() {
    return this.store.state$.pipe(
      map(({ sharedItems }) => Object.values(sharedItems))
    );
  }
  public sharedItemsForIds$(itemIds: string[]) {
    return this.store.state$.pipe(
      map(({ sharedItems, indexPerVaultItemId }) =>
        itemIds.map((itemId) => sharedItems[indexPerVaultItemId[itemId].id])
      )
    );
  }
  public sharedItemForId$(itemId: string) {
    return this.store.state$.pipe(
      map(
        ({ sharedItems, indexPerVaultItemId }) =>
          sharedItems[indexPerVaultItemId[itemId].id]
      )
    );
  }
}
