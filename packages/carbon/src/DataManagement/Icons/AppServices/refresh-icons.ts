import { IconsCache } from "Session/Store/Icons";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
const CACHE_TIME_SECONDS = (7 + Math.random()) * 86400;
export const isIconsCacheValid = (cachedIconsMap: IconsCache) => {
  if (!cachedIconsMap || !cachedIconsMap.lastUpdateTimeSeconds) {
    return false;
  }
  return (
    getUnixTimestamp() - cachedIconsMap.lastUpdateTimeSeconds <
    CACHE_TIME_SECONDS
  );
};
