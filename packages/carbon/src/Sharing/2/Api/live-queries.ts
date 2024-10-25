import { SharingCapacity } from "@dashlane/communication";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { LiveQuery } from "Shared/Api";
import { UserGroupLiveQueries } from "Sharing/2/UserGroup/Api/live-queries";
import { SharingUserLiveQueries } from "Sharing/2/SharingUser/Api/live-queries";
type SharingGeneralLiveQueries = {
  liveAllSharedItemIds: LiveQuery<void, string[]>;
  liveMyAcceptedUserGroups: LiveQuery<void, UserGroupDownload[]>;
  liveSharingCapacity: LiveQuery<void, SharingCapacity>;
};
export type SharingLiveQueries = UserGroupLiveQueries &
  SharingUserLiveQueries &
  SharingGeneralLiveQueries;
