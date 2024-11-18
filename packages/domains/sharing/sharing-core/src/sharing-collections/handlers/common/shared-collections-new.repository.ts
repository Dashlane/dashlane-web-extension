import { Observable } from "rxjs";
import { SharedCollectionAccess } from "@dashlane/sharing-contracts";
import {
  SharedAccessCollectionState,
  SharedCollectionState,
} from "../../data-access/shared-collections.state";
export abstract class SharedCollectionsNewRepository {
  abstract getCollections(): Promise<Record<string, SharedCollectionState>>;
  abstract getCollectionsById(ids: string[]): Promise<SharedCollectionState[]>;
  abstract setCollections(
    collections: SharedCollectionState[],
    sharedCollectionsAccess: Record<string, SharedAccessCollectionState>
  ): void;
  abstract sharedCollectionsAccessForId$: (
    collectionId: string
  ) => Observable<SharedCollectionAccess | null>;
}
