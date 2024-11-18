import { map } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import { SharedAccess, SharedItem } from "@dashlane/sharing-contracts";
import { SharedItemsRepository } from "../handlers/common/shared-items-repository";
import {
  SharedItemsState,
  SharedItemsStore,
} from "../store/shared-items.store";
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
    sharedItems?: {
      sharedItem: SharedItem;
      revision: number;
    }[],
    sharedAccess?: Record<string, SharedAccess>
  ) {
    if (!sharedItems || !sharedAccess) {
      this.store.set({
        indexPerVaultItemId: {},
        sharedItems: {},
        sharedAccess: {},
      });
      return;
    }
    const currentState = await this.store.getState();
    await this.store.set(
      sharedItems.reduce((state, { sharedItem, revision }) => {
        state.sharedItems[sharedItem.sharedItemId] = sharedItem;
        state.indexPerVaultItemId[sharedItem.itemId] = {
          sharedItemId: sharedItem.sharedItemId,
          vaultItemId: sharedItem.itemId,
          revision,
        };
        state.sharedAccess[sharedItem.sharedItemId] =
          sharedAccess[sharedItem.sharedItemId] ??
          currentState.sharedAccess[sharedItem.sharedItemId];
        return state;
      }, safeCast<SharedItemsState>({ sharedItems: {}, indexPerVaultItemId: {}, sharedAccess: {} }))
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
        itemIds.reduce((acc, itemId) => {
          const shareItemSummary = indexPerVaultItemId[itemId];
          if (shareItemSummary) {
            const sharedItem = sharedItems[shareItemSummary.sharedItemId];
            if (sharedItem) {
              acc.push(sharedItem);
            }
          }
          return acc;
        }, safeCast<SharedItem[]>([]))
      )
    );
  }
  public sharedItemForId$(itemId: string) {
    return this.store.state$.pipe(
      map(({ sharedItems, indexPerVaultItemId }) =>
        indexPerVaultItemId[itemId]
          ? sharedItems[indexPerVaultItemId[itemId].sharedItemId]
          : null
      )
    );
  }
  public sharedAccess$() {
    return this.store.state$.pipe(
      map(({ sharedAccess }) => Object.values(sharedAccess))
    );
  }
  public sharedAccessForId$(itemId: string) {
    return this.store.state$.pipe(
      map(({ sharedAccess, indexPerVaultItemId }) => {
        const sharedItemSummary = indexPerVaultItemId[itemId];
        if (!sharedItemSummary) {
          return null;
        }
        const sharedItemId = sharedItemSummary.sharedItemId;
        return { sharedItemId, ...sharedAccess[sharedItemId] };
      })
    );
  }
  public sharedAccessForIds$(itemIds: string[]) {
    return this.store.state$.pipe(
      map(({ sharedAccess, indexPerVaultItemId }) =>
        itemIds.reduce((acc, itemId) => {
          const shareItemSummary = indexPerVaultItemId[itemId];
          if (shareItemSummary) {
            const sharedAccessEntry =
              sharedAccess[shareItemSummary.sharedItemId];
            if (sharedAccessEntry) {
              acc.push(sharedAccessEntry);
            }
          }
          return acc;
        }, safeCast<SharedAccess[]>([]))
      )
    );
  }
  public sharedAccessesById$(itemIds: string[]) {
    return this.store.state$.pipe(
      map(({ sharedAccess, indexPerVaultItemId }) =>
        itemIds.reduce((acc, itemId) => {
          const shareItemSummary = indexPerVaultItemId[itemId];
          if (shareItemSummary) {
            const sharedAccessEntry =
              sharedAccess[shareItemSummary.sharedItemId];
            if (sharedAccessEntry) {
              acc[itemId] = sharedAccessEntry;
            }
          }
          return acc;
        }, safeCast<Record<string, SharedAccess>>({}))
      )
    );
  }
}
