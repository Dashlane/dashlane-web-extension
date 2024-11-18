import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { SharingCapacity } from "@dashlane/communication";
import { Query } from "Shared/Api";
import { UserGroupQueries } from "Sharing/2/UserGroup/Api/queries";
import { SharingUserQueries } from "Sharing/2/SharingUser/Api/queries";
type SharingGeneralQueries = {
  getAllSharedItemIds: Query<void, string[]>;
  getMyAcceptedUserGroups: Query<void, UserGroupDownload[]>;
  getSharingCapacity: Query<void, SharingCapacity>;
};
export type SharingQueries = UserGroupQueries &
  SharingUserQueries &
  SharingGeneralQueries;
