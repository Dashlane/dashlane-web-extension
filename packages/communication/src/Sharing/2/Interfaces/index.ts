export * from "./UserGroup";
export * from "./SharingSync";
export * from "./SharingActions";
import {
  ItemContent,
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
export interface SharingData {
  items: ItemContent[];
  itemGroups: ItemGroupDownload[];
  userGroups: UserGroupDownload[];
}
