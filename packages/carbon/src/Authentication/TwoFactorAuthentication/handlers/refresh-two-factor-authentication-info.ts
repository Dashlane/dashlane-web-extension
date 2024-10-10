import { RefreshTwoFactorAuthenticationInfoResult } from "@dashlane/communication";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import {
  TwoFactorAuthStatusError,
  TwoFactorAuthStatusRequested,
} from "Authentication/TwoFactorAuthentication/Store/actions";
import { refreshTwoFactorAuthenticationInfoService } from "Authentication/TwoFactorAuthentication/services";
export const refreshTwoFactorAuthenticationInfoHandler = async (
  services: CoreServices
): Promise<RefreshTwoFactorAuthenticationInfoResult> => {
  const { storeService, wsService } = services;
  try {
    const isUserAuthenticated = storeService.isAuthenticated;
    const login = userLoginSelector(storeService.getState());
    storeService.dispatch(TwoFactorAuthStatusRequested());
    if (!login || !isUserAuthenticated) {
      storeService.dispatch(TwoFactorAuthStatusError());
      return {
        success: false,
      };
    }
    const twoFactorAuthenticationInfo =
      await refreshTwoFactorAuthenticationInfoService(storeService, wsService);
    if (twoFactorAuthenticationInfo.success === false) {
      storeService.dispatch(TwoFactorAuthStatusError());
      return {
        success: false,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    storeService.dispatch(TwoFactorAuthStatusError());
    return {
      success: false,
    };
  }
};
