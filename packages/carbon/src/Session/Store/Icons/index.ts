import { IconDataStructure } from "@dashlane/communication";
import {
  ICONS_CACHE_EMPTY,
  ICONS_CACHE_LOADED,
  ICONS_REFRESHED,
  ICONS_UPDATED,
  IconsAction,
} from "Session/Store/Icons/actions";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { computeHashMD5 } from "Libs/CryptoCenter/Primitives/Hash";
import { IconDataWithDomain } from "Libs/WS/IconCrawler";
export type IconDomains = Map<string, IconDataStructure>;
export interface IconsCache {
  lastUpdateTimeSeconds: number;
  domains: IconDomains;
}
function getUpdatedIconsCache(
  currentDomains: IconDomains,
  icons: IconDataWithDomain[]
) {
  const iconsWithDomain = icons.filter((icon) => {
    return !!icon.domain;
  });
  if (!iconsWithDomain.length) {
    return currentDomains;
  }
  const domainsToMerge = new Map();
  let hasDomainChanged = false;
  for (const current of iconsWithDomain) {
    const { domain, ...iconRest } = current;
    const hash = computeHashMD5(domain);
    if (!currentDomains.get(hash)) {
      hasDomainChanged = true;
      domainsToMerge.set(hash, iconRest);
    }
  }
  if (hasDomainChanged) {
    return new Map([...currentDomains, ...domainsToMerge]);
  }
  return currentDomains;
}
export function getEmptyIconByDomains(): IconsCache {
  return {
    domains: new Map(),
    lastUpdateTimeSeconds: 0,
  };
}
export default (
  state = getEmptyIconByDomains(),
  action: IconsAction
): IconsCache => {
  switch (action.type) {
    case ICONS_UPDATED: {
      const newDomains = getUpdatedIconsCache(state.domains, action.data);
      if (state.domains !== newDomains) {
        return {
          ...state,
          domains: newDomains,
        };
      }
      return state;
    }
    case ICONS_REFRESHED:
      return {
        ...state,
        domains: getUpdatedIconsCache(state.domains, action.data),
        lastUpdateTimeSeconds: getUnixTimestamp(),
      };
    case ICONS_CACHE_LOADED:
      return action.data;
    case ICONS_CACHE_EMPTY:
      return getEmptyIconByDomains();
    default:
      return state;
  }
};
