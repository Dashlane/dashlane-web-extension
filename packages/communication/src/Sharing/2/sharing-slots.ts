import { slot } from "ts-event-bus";
import { UserGroupDownload } from "@dashlane/sharing/types/serverResponse";
import { ListResults, liveSlot } from "../../CarbonApi";
import { MemberPermission, ShareItemRequest } from "./Interfaces";
import {
  ConvertDashlaneXmlToItemRequest,
  ConvertDashlaneXmlToItemResult,
  ConvertItemToDashlaneXmlRequest,
  ConvertItemToDashlaneXmlResult,
  GetUserGroupMembersRequest,
  SaveSharedItemsToVaultRequest,
  ShareItemResult,
  SharingCapacity,
  SharingUserDataQueryRequest,
  SharingUserPermissionLevelRequest,
  SharingUserView,
  UserGroupDataQueryRequest,
  UserGroupMemberView,
  UserGroupView,
} from "./types";
export const sharingQueriesSlots = {
  getAllSharedItemIds: slot<void, string[]>(),
  getMyAcceptedUserGroups: slot<void, UserGroupDownload[]>(),
  getSharingCapacity: slot<void, SharingCapacity>(),
  getUserGroups: slot<UserGroupDataQueryRequest, ListResults<UserGroupView>>(),
  getUserGroup: slot<string, UserGroupView | undefined>(),
  getUserGroupMembers: slot<
    GetUserGroupMembersRequest,
    ListResults<UserGroupMemberView>
  >(),
  getSharingUsers: slot<
    SharingUserDataQueryRequest,
    ListResults<SharingUserView>
  >(),
  getSharingUserPermissionLevel: slot<
    SharingUserPermissionLevelRequest,
    MemberPermission | undefined
  >(),
};
export const sharingLiveQueriesSlots = {
  liveAllSharedItemIds: liveSlot<string[]>(),
  liveMyAcceptedUserGroups: liveSlot<UserGroupDownload[]>(),
  liveSharingCapacity: liveSlot<SharingCapacity>(),
  liveUserGroups: liveSlot<ListResults<UserGroupView>>(),
  liveSharingUsers: liveSlot<ListResults<SharingUserView>>(),
  liveSharingUserPermissionLevel: liveSlot<MemberPermission | undefined>(),
};
export const sharingCommandsSlots = {
  convertItemToDashlaneXml: slot<
    ConvertItemToDashlaneXmlRequest,
    ConvertItemToDashlaneXmlResult
  >(),
  convertDashlaneXmlToItem: slot<
    ConvertDashlaneXmlToItemRequest,
    ConvertDashlaneXmlToItemResult
  >(),
  saveSharedItemsToVault: slot<SaveSharedItemsToVaultRequest, void>(),
  shareItem: slot<ShareItemRequest, ShareItemResult>(),
};
