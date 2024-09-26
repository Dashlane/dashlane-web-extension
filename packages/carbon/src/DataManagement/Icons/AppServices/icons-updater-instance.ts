import { StoreService } from "Store";
import { IconsUpdater } from "DataManagement/Icons/AppServices/icons-updater";
import { LocalStorageService } from "Libs/Storage/Local/types";
import { WSService } from "Libs/WS";
import { IconsWS } from "DataManagement/Icons/Gateways/icons-ws";
let updater: IconsUpdater | null = null;
export const setInstance = (
  storeService: StoreService,
  localStorageService: LocalStorageService,
  wsService: WSService
): IconsUpdater => {
  updater =
    updater ||
    new IconsUpdater(localStorageService, storeService, new IconsWS(wsService));
  return updater;
};
export const getInstance = (): IconsUpdater | null => updater;
export const clearInstance = () => {
  if (updater) {
    updater.teardown();
  }
  updater = null;
};
