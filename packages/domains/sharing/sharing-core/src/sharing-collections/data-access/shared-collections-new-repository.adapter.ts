import { map } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import { SharedCollectionsNewRepository } from "../handlers/common/shared-collections-new.repository";
import { SharedCollectionsStore } from "../store/shared-collections.store";
import {
  SharedAccessCollectionState,
  SharedCollectionsState,
  SharedCollectionState,
} from "./shared-collections.state";
@Injectable()
export class SharedCollectionsNewRepositoryAdapter
  implements SharedCollectionsNewRepository
{
  public constructor(private store: SharedCollectionsStore) {}
  async getCollections() {
    const { collections } = await this.store.getState();
    return collections;
  }
  async getCollectionsById(ids: string[]) {
    const { collections } = await this.store.getState();
    return ids.reduce((acc, id) => {
      if (collections[id]) {
        acc.push(collections[id]);
      }
      return acc;
    }, safeCast<SharedCollectionState[]>([]));
  }
  async setCollections(
    collections: SharedCollectionState[],
    sharedCollectionsAccess: Record<string, SharedAccessCollectionState>
  ) {
    const currentState = await this.store.getState();
    await this.store.set(
      collections.reduce((state, coll) => {
        state.collections[coll.id] = coll;
        state.sharedCollectionsAccess[coll.id] =
          sharedCollectionsAccess[coll.id] ??
          currentState.sharedCollectionsAccess[coll.id];
        return state;
      }, safeCast<SharedCollectionsState>({ collections: {}, sharedCollectionsAccess: {} }))
    );
  }
  public sharedCollectionsAccessForId$(collectionId: string) {
    return this.store.state$.pipe(
      map(({ sharedCollectionsAccess }) => {
        return sharedCollectionsAccess[collectionId];
      })
    );
  }
}
