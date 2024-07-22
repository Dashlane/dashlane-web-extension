import { Injectable } from "@dashlane/framework-application";
import { map, Observable } from "rxjs";
import { SharedCollection } from "@dashlane/sharing-contracts";
import { SharedCollectionsRepository } from "../handlers/common/shared-collections.repository";
import { SharedCollectionsStore } from "./shared-collections.store";
import { SharedCollectionState } from "./shared-collections.state";
import { safeCast } from "@dashlane/framework-types";
const mapToLegacyCollection = ({
  id,
  name,
  revision,
  publicKey,
  privateKey,
}: SharedCollectionState) => ({
  uuid: id,
  name,
  revision,
  publicKey,
  privateKey,
});
@Injectable()
export class SharedCollectionsRepositoryAdapter
  implements SharedCollectionsRepository
{
  public constructor(private store: SharedCollectionsStore) {}
  public async getCollectionsByIds(ids: string[]): Promise<SharedCollection[]> {
    const state = await this.store.getState();
    return ids.reduce((collections, collectionId) => {
      const collection = state.collections[collectionId];
      if (collection) {
        collections.push(mapToLegacyCollection(collection));
      }
      return collections;
    }, safeCast<SharedCollection[]>([]));
  }
  public async getCollections() {
    const state = await this.store.getState();
    return Object.values(state.collections).map((coll) =>
      mapToLegacyCollection(coll)
    );
  }
  public collections$(): Observable<SharedCollection[]> {
    return this.store.state$.pipe(
      map((state) =>
        Object.values(state.collections).map((coll) =>
          mapToLegacyCollection(coll)
        )
      )
    );
  }
  public collection$(id: string): Observable<SharedCollection | undefined> {
    return this.collections$().pipe(
      map((collections) =>
        collections.find((collection) => collection.uuid === id)
      )
    );
  }
  public async getCollection(collectionId: string) {
    const state = await this.store.getState();
    const collection = state.collections[collectionId];
    if (!collection) {
      return undefined;
    }
    return mapToLegacyCollection(collection);
  }
  public async updateCollections() {
    throw new Error("not supported");
  }
}
