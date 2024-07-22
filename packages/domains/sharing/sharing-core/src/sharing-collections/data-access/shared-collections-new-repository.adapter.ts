import { Injectable } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import { SharedCollectionsNewRepository } from "../handlers/common/shared-collections-new.repository";
import { SharedCollectionsStore } from "./shared-collections.store";
import { SharedCollectionState } from "./shared-collections.state";
@Injectable()
export class SharedCollectionsNewRepositoryAdapter
  implements SharedCollectionsNewRepository
{
  public constructor(private store: SharedCollectionsStore) {}
  async getCollections() {
    const { collections } = await this.store.getState();
    return collections;
  }
  async setCollections(collections: SharedCollectionState[]) {
    await this.store.set({
      collections: collections.reduce((acc, coll) => {
        acc[coll.id] = coll;
        return acc;
      }, safeCast<Record<string, SharedCollectionState>>({})),
    });
  }
}
