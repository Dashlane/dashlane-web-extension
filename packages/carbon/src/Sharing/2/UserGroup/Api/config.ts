import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
import { UserGroupQueries } from "Sharing/2/UserGroup/Api/queries";
import { UserGroupLiveQueries } from "Sharing/2/UserGroup/Api/live-queries";
import {
  viewedUserGroupSelector,
  viewedUserGroupsSelector,
} from "Sharing/2/UserGroup/selectors";
import { userGroups$ } from "Sharing/2/UserGroup/live";
import { viewedUserGroupMembersSelector } from "Sharing/2/UserGroup/UserGroupMembers/selectors";
export const config: CommandQueryBusConfig<
  NoCommands,
  UserGroupQueries,
  UserGroupLiveQueries
> = {
  commands: {},
  queries: {
    getUserGroups: { selector: viewedUserGroupsSelector },
    getUserGroup: { selector: viewedUserGroupSelector },
    getUserGroupMembers: { selector: viewedUserGroupMembersSelector },
  },
  liveQueries: {
    liveUserGroups: { operator: userGroups$ },
  },
};
