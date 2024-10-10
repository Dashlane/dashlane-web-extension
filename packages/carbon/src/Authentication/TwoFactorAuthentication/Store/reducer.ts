import {
  TwoFactorAuthenticationInfo,
  TwoFactorAuthenticationInfoRequestStatus,
  TwoFactorAuthenticationInfoUnknown,
} from "@dashlane/communication";
import {
  TWO_FACTOR_AUTHENTICATION_INFO_ERROR,
  TWO_FACTOR_AUTHENTICATION_INFO_REQUESTED,
  TWO_FACTOR_AUTHENTICATION_INFO_UPDATED,
  TwoFactorAuthenticationAction,
} from "./actions";
import { TwoFactorAuthenticationEnabled } from "Authentication/TwoFactorAuthentication/constants";
export const getEmptyTwoFactorAuthenticationState =
  (): TwoFactorAuthenticationInfoUnknown => ({
    status: TwoFactorAuthenticationInfoRequestStatus.UNKNOWN,
  });
export const TwoFactorAuthenticationReducer = (
  state = getEmptyTwoFactorAuthenticationState(),
  action: TwoFactorAuthenticationAction
): TwoFactorAuthenticationInfo => {
  const totpType = action?.info?.type;
  switch (action.type) {
    case TWO_FACTOR_AUTHENTICATION_INFO_REQUESTED: {
      return {
        status: TwoFactorAuthenticationInfoRequestStatus.PENDING,
      };
    }
    case TWO_FACTOR_AUTHENTICATION_INFO_ERROR: {
      return {
        status: TwoFactorAuthenticationInfoRequestStatus.ERROR,
      };
    }
    case TWO_FACTOR_AUTHENTICATION_INFO_UPDATED: {
      return {
        ...action.info,
        isTwoFactorAuthenticationEnabled:
          TwoFactorAuthenticationEnabled.includes(totpType),
        status: TwoFactorAuthenticationInfoRequestStatus.READY,
      };
    }
    default:
      return state;
  }
};
