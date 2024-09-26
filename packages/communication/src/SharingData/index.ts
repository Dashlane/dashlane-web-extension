import {
  UserGroupDownload,
  ItemGroupDownload,
  ItemContent,
} from "@dashlane/sharing/types/serverResponse";
export interface SharingDataUpdatedEvent {
  items?: ItemContent[];
  itemGroups?: ItemGroupDownload[];
  userGroups?: UserGroupDownload[];
}
