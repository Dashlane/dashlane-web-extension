import { getTwoFactorAuthenticationStatus, isApiError } from "Libs/DashlaneApi";
import { userLoginSelector } from "Session/selectors";
import { TwoFactorAuthenticationEnabled } from "../constants";
import { ukiSelector } from "Authentication/selectors";
import { StoreService } from "Store";
import { WSService } from "Libs/WS";
import {
  TwoFactorAuthStatusError,
  TwoFactorAuthStatusUpdated,
} from "../Store/actions";
import {
  ENFORCE_TWO_FACTOR_AUTHENTICATION_ENABLED_VALUES,
  TwoFactorAuthenticationClientInfo,
  TwoFactorAuthenticationServerType,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { sendExceptionLog } from "Logs/Exception";
import { CarbonError } from "Libs/Error";
const TwoFactorAuthenticationTypeMap: Record<
  TwoFactorAuthenticationServerType,
  TwoFactorAuthenticationType
> = {
  email_token: TwoFactorAuthenticationType.EMAIL_TOKEN,
  totp_login: TwoFactorAuthenticationType.LOGIN,
  totp_device_registration: TwoFactorAuthenticationType.DEVICE_REGISTRATION,
  sso: TwoFactorAuthenticationType.SSO,
};
type TwoFactorAuthenticationInfoResultError = {
  success: false;
};
type TwoFactorAuthenticationInfoResultSuccess = {
  success: true;
  info: TwoFactorAuthenticationClientInfo;
};
type TwoFactorAuthenticationInfoResult =
  | TwoFactorAuthenticationInfoResultError
  | TwoFactorAuthenticationInfoResultSuccess;
export const refreshTwoFactorAuthenticationInfoService = async (
  storeService: StoreService,
  wsService: WSService
): Promise<TwoFactorAuthenticationInfoResult> => {
  try {
    const login = userLoginSelector(storeService.getState());
    const twoFactorAuthenticationStatus =
      await getTwoFactorAuthenticationStatus(storeService, login);
    if (isApiError(twoFactorAuthenticationStatus)) {
      storeService.dispatch(TwoFactorAuthStatusError());
      return {
        success: false,
      };
    }
    const mappedType =
      TwoFactorAuthenticationTypeMap[twoFactorAuthenticationStatus.type];
    const isTwoFactorAuthenticationEnabled =
      TwoFactorAuthenticationEnabled.includes(mappedType);
    let isTwoFactorAuthenticationEnforced = false;
    const planDetailsResponse = await wsService.premium.status({
      login: userLoginSelector(storeService.getState()),
      uki: ukiSelector(storeService.getState()),
      spaces: true,
    });
    const { spaces } = planDetailsResponse;
    if (spaces) {
      isTwoFactorAuthenticationEnforced = spaces.some((space) => {
        const {
          info: { twoFAEnforced },
        } = space;
        return ENFORCE_TWO_FACTOR_AUTHENTICATION_ENABLED_VALUES.includes(
          twoFAEnforced
        );
      });
    }
    const shouldEnforceTwoFactorAuthentication =
      !isTwoFactorAuthenticationEnabled && isTwoFactorAuthenticationEnforced;
    const info = {
      ...twoFactorAuthenticationStatus,
      isTwoFactorAuthenticationEnabled,
      isTwoFactorAuthenticationEnforced,
      shouldEnforceTwoFactorAuthentication,
      type: mappedType,
    };
    storeService.dispatch(TwoFactorAuthStatusUpdated(info));
    return {
      success: true,
      info,
    };
  } catch (error) {
    storeService.dispatch(TwoFactorAuthStatusError());
    const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
      "Refresh 2FA info",
      "refresh-two-factor-authentication-service.ts"
    );
    void sendExceptionLog({ error: augmentedError });
    return {
      success: false,
    };
  }
};
