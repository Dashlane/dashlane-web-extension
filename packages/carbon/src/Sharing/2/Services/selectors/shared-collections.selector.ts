import { State } from "Store";
import { CollectionDownload, ItemGroupDownload } from "../collection-helpers";
export const sharedCollectionsSelector = (
  state: State
): CollectionDownload[] | undefined =>
  state.userSession.sharingData.collections;
export const sharedCollectionItemsSelector = (
  state: State
): ItemGroupDownload[] =>
  state.userSession.sharingData.itemGroups as ItemGroupDownload[];
