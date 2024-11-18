import { ApplicationBuildType, PlatformInfo } from "@dashlane/communication";
import {
  LOAD_ANONYMOUS_APPLICATION_ID,
  SAVE_CURRENT_LOCATION,
  SAVE_PLATFORM_INFO,
} from "Session/Store/platform/actions";
import { Action } from "Store";
export interface Location {
  country: string;
  isEu: boolean;
}
export interface Platform {
  info: PlatformInfo;
  location: Location;
}
export default (state = getEmptyPlatform(), action: Action) => {
  switch (action.type) {
    case SAVE_PLATFORM_INFO:
      return {
        ...state,
        info: setPlatformInfoWithDefaults(action.info, defaultPlatformInfo),
      };
    case SAVE_CURRENT_LOCATION:
      return {
        ...state,
        location: action.location,
      };
    case LOAD_ANONYMOUS_APPLICATION_ID:
      return {
        ...state,
        info: {
          ...state.info,
          anonymousApplicationId: action.anonymousApplicationId,
        },
      };
    default:
      return state;
  }
};
function setPlatformInfoWithDefaults(
  info: PlatformInfo,
  defaultInfo: PlatformInfo
): PlatformInfo {
  return {
    anonymousApplicationId:
      info.anonymousApplicationId || defaultInfo.anonymousApplicationId,
    platformName: info.platformName || defaultInfo.platformName,
    appVersion: info.appVersion || defaultInfo.appVersion,
    browser: info.browser || defaultInfo.browser,
    browserVersion: info.browserVersion || defaultInfo.browserVersion,
    country: info.country || defaultInfo.country,
    os: info.os || defaultInfo.os,
    osCountry: info.osCountry || defaultInfo.osCountry,
    osVersion: info.osVersion || defaultInfo.osVersion,
    lang: info.lang || defaultInfo.lang,
    manifestVersion: info.manifestVersion || defaultInfo.manifestVersion,
    buildType: info.buildType ?? ApplicationBuildType.__REDACTED__,
  };
}
const defaultLocation: Location = {
  country: null,
  isEu: true,
};
export const defaultPlatformInfo: PlatformInfo = {
  anonymousApplicationId: "unknown_anonymous_application_id",
  platformName: "server_carbon_unknown",
  appVersion: "unknown_version",
  browser: "browser_carbon_unknown",
  browserVersion: "unknown_browser_version",
  country: "country_carbon_unknown",
  os: "os_carbon_unknown",
  osCountry: "os_country_carbon_unknown",
  osVersion: "unknown_os_version",
  lang: "lang_carbon_unknown",
  buildType: ApplicationBuildType.__REDACTED__,
};
export function getEmptyPlatform(): Platform {
  return {
    info: defaultPlatformInfo,
    location: defaultLocation,
  };
}
