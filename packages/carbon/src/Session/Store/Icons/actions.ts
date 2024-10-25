import { Action } from "Store";
import { IconDataWithDomain } from "Libs/WS/IconCrawler";
import { IconsCache } from "Session/Store/Icons";
export const ICONS_UPDATED = "ICONS_UPDATED";
export const ICONS_REFRESHED = "ICONS_REFRESHED";
export const ICONS_CACHE_LOADED = "ICONS_CACHE_LOADED";
export const ICONS_CACHE_EMPTY = "ICONS_CACHE_EMPTY";
export interface IconsUpdatedAction extends Action {
  type: typeof ICONS_UPDATED;
  data: IconDataWithDomain[];
}
export const iconsUpdated = (
  domainsIcons: IconDataWithDomain[]
): IconsUpdatedAction => ({
  type: ICONS_UPDATED,
  data: domainsIcons,
});
export interface IconsRefreshedAction {
  type: typeof ICONS_REFRESHED;
  data: IconDataWithDomain[];
}
export const iconsRefreshed = (
  domainsIcons: IconDataWithDomain[]
): IconsRefreshedAction => ({
  type: ICONS_REFRESHED,
  data: domainsIcons,
});
export interface IconsCacheLoadedAction extends Action {
  type: typeof ICONS_CACHE_LOADED;
  data: IconsCache;
}
export const IconsCacheLoaded = (
  iconsCache: IconsCache
): IconsCacheLoadedAction => ({
  type: ICONS_CACHE_LOADED,
  data: iconsCache,
});
export interface ClearIconsCacheAction extends Action {
  type: typeof ICONS_CACHE_EMPTY;
  data: IconsCache;
}
export const clearIconsCache = () => ({
  type: ICONS_CACHE_EMPTY,
});
export type IconsAction =
  | IconsUpdatedAction
  | IconsRefreshedAction
  | IconsCacheLoadedAction
  | ClearIconsCacheAction;
