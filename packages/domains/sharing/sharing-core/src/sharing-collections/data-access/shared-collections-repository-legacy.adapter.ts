import { map, Observable } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { SharedCollection } from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../handlers/common/shared-collections.repository";
import { SharedCollectionsLegacyStore } from "./shared-collections-legacy.store";
@Injectable()
export class SharedCollectionsRepositoryLegacyAdapter
  implements SharedCollectionsRepository
{
  public constructor(private store: SharedCollectionsLegacyStore) {}
  public async getCollectionsByIds(ids: string[]): Promise<SharedCollection[]> {
    const state = await this.store.getState();
    return state.sharedCollections.filter((c) => ids.includes(c.uuid));
  }
  public async getCollections() {
    const state = await this.store.getState();
    return state.sharedCollections;
  }
  public collections$(): Observable<SharedCollection[]> {
    return this.store.state$.pipe(map((state) => state.sharedCollections));
  }
  public collection$(id: string): Observable<SharedCollection | undefined> {
    return this.collections$().pipe(
      map((collections) =>
        collections.find((collection) => collection.uuid === id)
      )
    );
  }
  public async getCollection(id: string) {
    const state = await this.store.getState();
    const collection = state.sharedCollections.find((c) => c.uuid === id);
    if (!collection) {
      return undefined;
    }
    return collection;
  }
  public async updateCollections(collections: SharedCollection[]) {
    await this.store.set({
      sharedCollections: [...collections],
    });
  }
}
