import { Observable } from "rxjs";
import {
  SharedCollection,
  SharedCollectionRole,
  UsersAndGroupsInCollection,
} from "@dashlane/sharing-contracts";
import { Result } from "@dashlane/framework-types";
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
  public abstract getGroupRoleInCollection$(
    collectionId: string,
    groupId?: string
  ): Observable<SharedCollectionRole>;
  public abstract usersAndGroupsInCollection(
    collectionIds: string[]
  ): Observable<Result<UsersAndGroupsInCollection>>;
}
