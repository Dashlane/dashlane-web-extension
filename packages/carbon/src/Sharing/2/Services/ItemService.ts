import {
  AddItems as AddItemsEvent,
  ItemUpload,
} from "@dashlane/sharing/types/addItems";
import { Credential, Note, Secret } from "@dashlane/communication";
import { RemoveItems as RemoveItemsEvent } from "@dashlane/sharing/types/removeItems";
import { UpdateItem as UpdateItemEvent } from "@dashlane/sharing/types/updateItem";
import { ItemforEmailing } from "@dashlane/sharing/types/createItemGroup";
import { WSService } from "Libs/WS/index";
import { ItemGroupResponse } from "Libs/WS/Sharing/2/PerformItemGroupAction";
import { makeSymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
export interface ItemService {
  makeItemUpload: (
    itemId: string,
    itemKey: string,
    content: string
  ) => Promise<ItemUpload>;
  makeAddItemsEvent: (
    groupId: string,
    revision: number,
    items: ItemUpload[]
  ) => Promise<AddItemsEvent>;
  makeItemForEmailing: (item: Credential | Note | Secret) => ItemforEmailing;
  addItems: (
    wsService: WSService,
    login: string,
    uki: string,
    event: AddItemsEvent
  ) => Promise<ItemGroupResponse>;
  makeUpdateItemEvent: (
    timestamp: number,
    itemKey: string,
    payload: {
      item?: Credential | Note | Secret;
      itemId?: string;
      itemContent?: string;
    }
  ) => Promise<UpdateItemEvent>;
  updateItem: (
    wsService: WSService,
    login: string,
    uki: string,
    event: UpdateItemEvent
  ) => Promise<ItemGroupResponse>;
  makeRemoveItemsEvent: (
    groupId: string,
    revision: number,
    itemsIds: string[]
  ) => Promise<RemoveItemsEvent>;
  removeItems: (
    wsService: WSService,
    login: string,
    uki: string,
    event: RemoveItemsEvent
  ) => Promise<ItemGroupResponse>;
}
export const REMOVE_ITEMS = "removeItems";
export const ADD_ITEMS = "addItems";
export const UPDATE_ITEM = "updateItem";
export const SHARING_VERSION = 4;
async function makeItemUpload(
  itemId: string,
  itemKey: string,
  content: string
): Promise<ItemUpload> {
  return { itemId, itemKey, content };
}
function getSharingItemType(
  item: Credential | Note | Secret
): "password" | "note" | "secret" {
  switch (item.kwType) {
    case "KWAuthentifiant":
      return "password";
    case "KWSecureNote":
      return "note";
    default:
      return "secret";
  }
}
function makeItemForEmailing(
  item: Credential | Note | Secret
): ItemforEmailing {
  const type = getSharingItemType(item);
  const name = item.Title || `Untitled ${type}`;
  return { type, name };
}
async function makeAddItemsEvent(
  groupId: string,
  revision: number,
  items: ItemUpload[]
): Promise<AddItemsEvent> {
  return {
    type: ADD_ITEMS,
    sharingVersion: SHARING_VERSION,
    revision,
    groupId,
    items,
  };
}
async function makeUpdateItemEvent(
  timestamp: number,
  itemKey: string,
  payload: {
    item?: Credential | Note | Secret;
    itemId?: string;
    itemContent?: string;
  }
): Promise<UpdateItemEvent> {
  if (!payload) {
    throw new Error("Missing payload. See method documentation.");
  }
  const { item, itemId, itemContent } = payload;
  if (!item && !(itemId && itemContent)) {
    throw new Error(
      "insufficient arguments: item or (itemId and content) must be provided."
    );
  }
  if (item && (itemId || itemContent)) {
    throw new Error("item and (itemId | content) cannot both be provided");
  }
  const crypto = makeSymmetricEncryption();
  const content =
    itemContent ?? (await crypto.encryptSharingItem(itemKey, item));
  return {
    type: UPDATE_ITEM,
    sharingVersion: SHARING_VERSION,
    itemId: itemId ?? item?.Id,
    content: content,
    timestamp,
  };
}
const updateItem = (
  wsService: WSService,
  login: string,
  uki: string,
  event: UpdateItemEvent
): Promise<ItemGroupResponse> => {
  return wsService.itemGroup.updateItem(login, uki, event);
};
function addItems(
  wsService: WSService,
  login: string,
  uki: string,
  event: AddItemsEvent
): Promise<ItemGroupResponse> {
  return wsService.itemGroup.addItems(login, uki, event);
}
const makeRemoveItemsEvent = (
  groupId: string,
  revision: number,
  itemsIds: string[]
): Promise<RemoveItemsEvent> => {
  return Promise.resolve({
    type: REMOVE_ITEMS,
    sharingVersion: SHARING_VERSION,
    groupId,
    revision,
    items: [...itemsIds],
  });
};
const removeItems = (
  wsService: WSService,
  login: string,
  uki: string,
  event: RemoveItemsEvent
): Promise<ItemGroupResponse> => {
  return wsService.itemGroup.removeItems(login, uki, event);
};
export function makeItemService(): ItemService {
  return {
    makeItemUpload,
    makeAddItemsEvent,
    makeItemForEmailing,
    addItems,
    makeUpdateItemEvent,
    updateItem,
    makeRemoveItemsEvent,
    removeItems,
  };
}
