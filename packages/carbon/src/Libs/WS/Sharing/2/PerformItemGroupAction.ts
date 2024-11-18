import { _makeRequest } from "Libs/WS/request";
import { CreateUserGroupsItemGroupEvent } from "@dashlane/sharing/types/createUserGroupsItemGroup";
import { DeleteItemGroupEvent } from "@dashlane/sharing/types/deleteItemGroup";
import { CreateItemGroupEvent } from "@dashlane/sharing/types/createItemGroup";
import { UpdateItemGroupMembers } from "@dashlane/sharing/types/updateItemGroupMembers";
import {
  ItemContent,
  ItemGroupDownload,
  ServerResponse,
} from "@dashlane/sharing/types/serverResponse";
import { AddItems as AddItemsEvent } from "@dashlane/sharing/types/addItems";
import { RemoveItems as RemoveItemsEvent } from "@dashlane/sharing/types/removeItems";
import { UpdateItem as UpdateItemEvent } from "@dashlane/sharing/types/updateItem";
import { AcceptItemGroup } from "@dashlane/sharing/types/acceptItemGroup";
import { RefuseItemGroup } from "@dashlane/sharing/types/refuseItemGroup";
import { InviteItemGroupMembers } from "@dashlane/sharing/types/inviteItemGroupMembers";
import { AuditLogDetails } from "Sharing/2/Services/ItemGroupService";
import { RevokeItemGroupMembersWithOrigin } from "./types";
const WSVERSION = 2;
const WSNAME = "sharing";
const WSPATH = "performItemGroupAction";
export interface WSItemGroup {
  createSpecialItemGroup: (
    login: string,
    uki: string,
    createUserGroupEvent: CreateUserGroupsItemGroupEvent
  ) => Promise<ItemGroupDownload>;
  createItemGroup: (
    login: string,
    uki: string,
    createItemGroupEvent: CreateItemGroupEvent
  ) => Promise<ItemGroupResponse>;
  deleteGroup: (
    login: string,
    uki: string,
    deleteItemGroupEvent: DeleteItemGroupEvent
  ) => Promise<ItemGroupResponse>;
  addItems: (
    login: string,
    uki: string,
    addItemsEvent: AddItemsEvent
  ) => Promise<ItemGroupResponse>;
  updateItem: (
    login: string,
    uki: string,
    updateItemEvent: UpdateItemEvent
  ) => Promise<ItemGroupResponse>;
  acceptItemGroup: (
    login: string,
    uki: string,
    acceptItemGroupEvent: AcceptItemGroup
  ) => Promise<ItemGroupResponse>;
  refuseItemGroup: (
    login: string,
    uki: string,
    refuseItemGroupEvent: RefuseItemGroup
  ) => Promise<ItemGroupResponse>;
  inviteItemGroupMembers: (
    login: string,
    uki: string,
    inviteItemGroupEvent: InviteItemGroupMembers,
    auditLogDetails: AuditLogDetails
  ) => Promise<ItemGroupResponse>;
  revokeItemGroupMembers: (
    login: string,
    uki: string,
    revokeItemGroupMembers: RevokeItemGroupMembersWithOrigin
  ) => Promise<ItemGroupResponse>;
  updateItemGroupMembers: (
    login: string,
    uki: string,
    updateItemGroupMembers: UpdateItemGroupMembers
  ) => Promise<ItemGroupResponse>;
  removeItems: (
    login: string,
    uki: string,
    removeItemsEvent: RemoveItemsEvent
  ) => Promise<ItemGroupResponse>;
}
interface ItemGroupServerResponseWsResult {
  code: number;
  message: string;
  content: ServerResponse;
}
export interface ItemGroupResponse {
  itemGroups: ItemGroupDownload[];
  items?: ItemContent[];
}
function makeRequest<ItemGroupAction extends Object>(
  login: string,
  uki: string,
  itemGroupAction: ItemGroupAction
): Promise<ItemGroupResponse> {
  const data = {
    login,
    uki,
    action: JSON.stringify(itemGroupAction),
  };
  return _makeRequest(WSNAME, WSVERSION, WSPATH, data).then(
    (result: ItemGroupServerResponseWsResult) => {
      const content = result.content;
      const itemGroupErrors = content.itemGroupErrors;
      if (itemGroupErrors && itemGroupErrors.length > 0) {
        throw new Error(itemGroupErrors[0].message);
      }
      const { itemGroups, items } = content;
      return { itemGroups, items };
    }
  );
}
export const makeItemGroupWS = (): WSItemGroup => ({
  createSpecialItemGroup: (
    login: string,
    uki: string,
    createItemGroupEvent: CreateUserGroupsItemGroupEvent
  ): Promise<ItemGroupDownload> => {
    return makeRequest(login, uki, createItemGroupEvent).then(
      ({ itemGroups }) => itemGroups && itemGroups[0]
    );
  },
  createItemGroup: makeRequest,
  deleteGroup: (
    login: string,
    uki: string,
    deleteItemGroupEvent: DeleteItemGroupEvent
  ): Promise<ItemGroupResponse> => {
    return makeRequest(login, uki, deleteItemGroupEvent);
  },
  addItems: (
    login: string,
    uki: string,
    addItemsEvent: AddItemsEvent
  ): Promise<ItemGroupResponse> => {
    return makeRequest(login, uki, addItemsEvent);
  },
  updateItem: (
    login: string,
    uki: string,
    updateItemEvent: UpdateItemEvent
  ): Promise<ItemGroupResponse> => {
    return makeRequest(login, uki, updateItemEvent);
  },
  removeItems: (
    login: string,
    uki: string,
    removeItemsEvent: RemoveItemsEvent
  ): Promise<ItemGroupResponse> => {
    return makeRequest(login, uki, removeItemsEvent);
  },
  acceptItemGroup: makeRequest,
  refuseItemGroup: makeRequest,
  inviteItemGroupMembers: makeRequest,
  revokeItemGroupMembers: makeRequest,
  updateItemGroupMembers: makeRequest,
});
