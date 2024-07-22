import { Observable } from "rxjs";
import { RevisionSummary, SharedItem } from "@dashlane/sharing-contracts";
export interface SharedItemWithRevision {
  sharedItem: SharedItem;
  revision: number;
}
export abstract class SharedItemsRepository {
  abstract sharedItems$: () => Observable<SharedItem[]>;
  abstract sharedItemForId$: (itemId: string) => Observable<SharedItem | null>;
  abstract sharedItemsForIds$: (itemIds: string[]) => Observable<SharedItem[]>;
  abstract getSharedItemsIndex: () => Promise<Record<string, SharedItem>>;
  abstract getVaultItemsIndex: () => Promise<Record<string, RevisionSummary>>;
  abstract setSharedItems: (
    sharedItems: SharedItemWithRevision[]
  ) => Promise<void>;
}
