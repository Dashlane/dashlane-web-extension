import { StoreService } from "Store";
import {
  ICryptoService,
  makeCryptoService,
} from "Libs/CryptoCenter/SharingCryptoService";
import {
  IUserGroupService,
  makeUserGroupService,
} from "Sharing/2/Services/UserGroupService";
import {
  IItemGroupService,
  makeItemGroupService,
} from "Sharing/2/Services/ItemGroupService";
import { ItemService, makeItemService } from "Sharing/2/Services/ItemService";
import { WSService } from "Libs/WS/index";
export interface ISharingServices {
  store: StoreService;
  ws: WSService;
  crypto: ICryptoService;
  userGroup: IUserGroupService;
  itemGroup: IItemGroupService;
  item: ItemService;
}
export function makeSharingService(
  storeService: StoreService,
  wsService: WSService
): ISharingServices {
  const crypto = makeCryptoService();
  return {
    ws: wsService,
    store: storeService,
    crypto,
    userGroup: makeUserGroupService(wsService, crypto),
    itemGroup: makeItemGroupService(wsService, crypto),
    item: makeItemService(),
  };
}
