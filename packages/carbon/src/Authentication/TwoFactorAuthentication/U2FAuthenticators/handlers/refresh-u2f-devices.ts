import {
  RefreshU2FDevicesResult,
  RefreshU2FErrorCode,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getU2FDevices, isApiError } from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { u2fDevicesUpdated } from "Authentication/Store/u2f/actions";
export const refreshU2FDevicesListHandler = async (
  services: CoreServices
): Promise<RefreshU2FDevicesResult> => {
  try {
    const { storeService } = services;
    const isUserAuthenticated = storeService.isAuthenticated;
    const login = userLoginSelector(storeService.getState());
    if (!login || !isUserAuthenticated) {
      return {
        success: false,
        error: { code: RefreshU2FErrorCode.UNKNOWN_ERROR },
      };
    }
    const u2fDevicesList = await getU2FDevices(storeService, login);
    if (isApiError(u2fDevicesList)) {
      return {
        success: false,
        error: { code: RefreshU2FErrorCode.UNKNOWN_ERROR },
      };
    }
    storeService.dispatch(u2fDevicesUpdated(u2fDevicesList.u2fDevices));
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: { code: RefreshU2FErrorCode.UNKNOWN_ERROR },
    };
  }
};
