import {
  ItemContent,
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { CollectionDownload } from "@dashlane/server-sdk/v1";
export { UserGroupDownload };
export interface CollectionSummary {
  id: string;
  revision: number;
}
export interface ItemSummary {
  id: string;
  timestamp: number;
}
export interface ItemGroupSummary {
  id: string;
  revision: number;
}
export interface UserGroupSummary {
  id: string;
  revision: number;
}
export interface Sharing2Summary {
  collections?: CollectionSummary[];
  items: ItemSummary[];
  itemGroups: ItemGroupSummary[];
  userGroups: UserGroupSummary[];
}
export interface SharingData {
  collections?: CollectionDownload[];
  items: ItemContent[];
  itemGroups: ItemGroupDownload[];
  userGroups: UserGroupDownload[];
}
