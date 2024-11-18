import { IconsCache } from "Session/Store/Icons";
export const iconsToStorage = (iconsCache: IconsCache) => {
  return {
    ...iconsCache,
    domains: Array.from(iconsCache.domains.entries()),
  };
};
export const iconsFromStorage = (data: any): IconsCache => {
  return {
    ...data,
    domains: new Map(data.domains),
  };
};
