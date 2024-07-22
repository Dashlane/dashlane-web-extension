import { SharedCollection } from "@dashlane/sharing-contracts";
import { Observable } from "rxjs";
export abstract class SharedCollectionsRepository {
  public abstract getCollections(): Promise<SharedCollection[]>;
  public abstract collections$(): Observable<SharedCollection[]>;
  public abstract collection$(
    id: string
  ): Observable<SharedCollection | undefined>;
  public abstract getCollection(
    id: string
  ): Promise<SharedCollection | undefined>;
  public abstract getCollectionsByIds(
    ids: string[]
  ): Promise<SharedCollection[]>;
  public abstract updateCollections(
    collections: SharedCollection[]
  ): Promise<void>;
}
