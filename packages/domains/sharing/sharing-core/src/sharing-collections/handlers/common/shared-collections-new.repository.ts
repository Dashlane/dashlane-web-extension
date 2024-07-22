import { SharedCollectionState } from "../../data-access/shared-collections.state";
export abstract class SharedCollectionsNewRepository {
  abstract getCollections(): Promise<Record<string, SharedCollectionState>>;
  abstract setCollections(collections: SharedCollectionState[]): void;
}
