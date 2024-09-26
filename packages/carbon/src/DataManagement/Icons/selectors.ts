import { State } from "Store";
import { IconDomains, IconsCache } from "Session/Store/Icons";
export const iconsCacheSelector = (state: State): IconsCache =>
  state.userSession.iconsCache;
export const iconsSelector = (state: State): IconDomains =>
  iconsCacheSelector(state).domains;
