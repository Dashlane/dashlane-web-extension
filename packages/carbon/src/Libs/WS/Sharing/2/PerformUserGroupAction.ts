import { _makeRequest } from "Libs/WS/request";
import { CreateUserGroupEvent } from "@dashlane/sharing/types/userGroup/createUserGroup";
import { DeleteUserGroupEvent } from "@dashlane/sharing/types/userGroup/deleteUserGroup";
import { RenameUserGroup } from "@dashlane/sharing/types/userGroup/renameUserGroup";
import { InviteUserGroupUsers } from "@dashlane/sharing/types/userGroup/inviteUserGroupUsers";
import { RevokeUserGroupUsers } from "@dashlane/sharing/types/userGroup/revokeUserGroupUsers";
import { UpdateUserGroupUsers } from "@dashlane/sharing/types/userGroup/updateUserGroupUsers";
import { AcceptUserGroup } from "@dashlane/sharing/types/userGroup/acceptUserGroup";
import { RefuseUserGroup } from "@dashlane/sharing/types/userGroup/refuseUserGroup";
import {
  ItemContent,
  ItemGroupDownload,
  ServerResponse,
  UserGroupDownload,
} from "@dashlane/sharing/types/serverResponse";
import { CreateTeamAdminsUserGroupEvent } from "@dashlane/sharing/types/userGroup/createTeamAdminsUserGroup";
const WSVERSION = 1;
const WSNAME = "userGroup";
const WSPATH = "performUserGroupAction";
export interface WSUserGroup {
  create: (
    login: string,
    uki: string,
    createUserGroupEvent: CreateUserGroupEvent | CreateTeamAdminsUserGroupEvent
  ) => Promise<UserGroupResponse>;
  delete: (
    login: string,
    uki: string,
    deleteUserGroupEvent: DeleteUserGroupEvent
  ) => Promise<UserGroupResponse>;
  rename: (
    login: string,
    uki: string,
    renameUserGroupEvent: RenameUserGroup
  ) => Promise<UserGroupResponse>;
  invite: (
    login: string,
    uki: string,
    inviteItemGroupMembers: InviteUserGroupUsers
  ) => Promise<UserGroupResponse>;
  revoke: (
    login: string,
    uki: string,
    revokeItemGroupMembers: RevokeUserGroupUsers
  ) => Promise<UserGroupResponse>;
  update: (
    login: string,
    uki: string,
    updateItemGroupMembers: UpdateUserGroupUsers
  ) => Promise<UserGroupResponse>;
  accept: (
    login: string,
    uki: string,
    acceptUserGroup: AcceptUserGroup
  ) => Promise<UserGroupResponse>;
  refuse: (
    login: string,
    uki: string,
    refuseUserGroup: RefuseUserGroup
  ) => Promise<UserGroupResponse>;
}
interface UserGroupServerResponseWsResult {
  code: number;
  message: string;
  content: ServerResponse;
}
export interface UserGroupResponse {
  itemGroups?: ItemGroupDownload[];
  items?: ItemContent[];
  userGroups: UserGroupDownload[];
}
function makeRequest<UserGroupAction extends Object>(
  login: string,
  uki: string,
  userGroupAction: UserGroupAction
): Promise<UserGroupResponse> {
  const data = {
    login,
    uki,
    action: JSON.stringify(userGroupAction),
  };
  return _makeRequest(WSNAME, WSVERSION, WSPATH, data).then(
    (result: UserGroupServerResponseWsResult) => {
      const { itemGroups, items, userGroupErrors, userGroups } = result.content;
      if (userGroupErrors && userGroupErrors.length > 0) {
        throw new Error(userGroupErrors[0].message);
      }
      return { itemGroups, items, userGroups };
    }
  );
}
export const makeUserGroupWS = (): WSUserGroup => ({
  create: (
    login: string,
    uki: string,
    createUserGroupEvent: CreateUserGroupEvent
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, createUserGroupEvent);
  },
  delete: (
    login: string,
    uki: string,
    deleteUserGroupEvent: DeleteUserGroupEvent
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, deleteUserGroupEvent);
  },
  rename: (
    login: string,
    uki: string,
    renameUserGroupEvent: RenameUserGroup
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, renameUserGroupEvent);
  },
  invite: (
    login: string,
    uki: string,
    inviteUserGroupUsers: InviteUserGroupUsers
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, inviteUserGroupUsers);
  },
  revoke: (
    login: string,
    uki: string,
    revokeUserGroupUsers: RevokeUserGroupUsers
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, revokeUserGroupUsers);
  },
  update: (
    login: string,
    uki: string,
    updateUserGroupUsers: UpdateUserGroupUsers
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, updateUserGroupUsers);
  },
  accept: (
    login: string,
    uki: string,
    acceptUserGroup: AcceptUserGroup
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, acceptUserGroup);
  },
  refuse: (
    login: string,
    uki: string,
    refuseUserGroup: RefuseUserGroup
  ): Promise<UserGroupResponse> => {
    return makeRequest(login, uki, refuseUserGroup);
  },
});
