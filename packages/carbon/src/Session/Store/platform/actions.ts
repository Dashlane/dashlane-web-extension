import { PlatformInfo } from "@dashlane/communication";
import { Location } from "Session/Store/platform/";
import { Action } from "Store";
export const SAVE_PLATFORM_INFO = "SAVE_PLATFORM_INFO";
export const SAVE_CURRENT_LOCATION = "SAVE_CURRENT_LOCATION";
export const LOAD_ANONYMOUS_APPLICATION_ID = "LOAD_ANONYMOUS_APPLICATION_ID";
export const savePlatformInfo = (info: PlatformInfo): Action => {
  return {
    type: SAVE_PLATFORM_INFO,
    info,
  };
};
export const saveCurrentLocation = (location: Location): Action => {
  return {
    type: SAVE_CURRENT_LOCATION,
    location,
  };
};
export const loadedAnonymousComputerId = (
  anonymousApplicationId: string
): Action => {
  return {
    type: LOAD_ANONYMOUS_APPLICATION_ID,
    anonymousApplicationId,
  };
};
