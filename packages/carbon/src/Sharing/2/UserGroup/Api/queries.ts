import {
  GetUserGroupMembersRequest,
  ListResults,
  UserGroupDataQueryRequest,
  UserGroupMemberView,
  UserGroupView,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type UserGroupQueries = {
  getUserGroups: Query<UserGroupDataQueryRequest, ListResults<UserGroupView>>;
  getUserGroup: Query<string, UserGroupView | undefined>;
  getUserGroupMembers: Query<
    GetUserGroupMembersRequest,
    ListResults<UserGroupMemberView>
  >;
};
