import { defaultTo } from "ramda";
import { UserGroupView } from "@dashlane/communication";
import { UserGroup } from "Sharing/2/UserGroup/types";
import { listView as userGroupMemberListView } from "Sharing/2/UserGroup/UserGroupMembers/views";
const defaultToEmptyString = defaultTo("");
export const detailView = (userGroup: UserGroup): UserGroupView => {
  return {
    name: defaultToEmptyString(userGroup.name),
    id: defaultToEmptyString(userGroup.groupId),
    users: userGroupMemberListView(userGroup.users || []),
    itemCount: userGroup.itemCount,
  };
};
export const listView = (userGroups: UserGroup[]): UserGroupView[] =>
  userGroups.map(detailView);
