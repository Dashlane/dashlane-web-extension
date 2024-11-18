import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
import { SharingUserQueries } from "Sharing/2/SharingUser/Api/queries";
import { SharingUserLiveQueries } from "Sharing/2/SharingUser/Api/live-queries";
import {
  sharingUserPermissionLevelSelector,
  viewedSharingUsersSelector,
} from "Sharing/2/SharingUser/selectors";
import {
  sharingUserPermissionLevel$,
  sharingUsers$,
} from "Sharing/2/SharingUser/live";
export const config: CommandQueryBusConfig<
  NoCommands,
  SharingUserQueries,
  SharingUserLiveQueries
> = {
  commands: {},
  queries: {
    getSharingUsers: { selector: viewedSharingUsersSelector },
    getSharingUserPermissionLevel: {
      selector: sharingUserPermissionLevelSelector,
    },
  },
  liveQueries: {
    liveSharingUsers: { operator: sharingUsers$ },
    liveSharingUserPermissionLevel: {
      operator: sharingUserPermissionLevel$,
    },
  },
};
