import { Observable } from "rxjs";
import { SharedAccess, SharedItem } from "@dashlane/sharing-contracts";
import { SharedVaultItemEntry } from "../../store/shared-items.store";
export interface SharedItemWithRevision {
  sharedItem: SharedItem;
  revision: number;
  savedToVault?: boolean;
}
export interface SharedAccessWithSharedItemId extends SharedAccess {
  sharedItemId: string;
}
export abstract class SharedItemsRepository {
  abstract sharedItems$: () => Observable<SharedItem[]>;
  abstract sharedItemForId$: (itemId: string) => Observable<SharedItem | null>;
  abstract sharedItemsForIds$: (itemIds: string[]) => Observable<SharedItem[]>;
  abstract sharedAccess$: () => Observable<SharedAccess[]>;
  abstract sharedAccessForIds$: (
    itemIds: string[]
  ) => Observable<SharedAccess[]>;
  abstract sharedAccessesById$: (
    itemIds: string[]
  ) => Observable<Record<string, SharedAccess>>;
  abstract sharedAccessForId$: (
    itemId: string
  ) => Observable<SharedAccessWithSharedItemId | null>;
  abstract getSharedItemsIndex: () => Promise<Record<string, SharedItem>>;
  abstract getVaultItemsIndex: () => Promise<
    Record<string, SharedVaultItemEntry>
  >;
  abstract setSharedItems: (
    sharedItems?: SharedItemWithRevision[],
    sharedAccess?: Record<string, SharedAccess>
  ) => Promise<void>;
}
