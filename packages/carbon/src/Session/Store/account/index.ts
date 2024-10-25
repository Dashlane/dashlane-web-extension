import { AccountAuthenticationType } from "@dashlane/communication";
import { Action } from "Store";
import { OPEN_SESSION } from "Session/Store/actions";
import { DEVICE_REGISTERED } from "Authentication/Store/actions";
import {
  CONFIRM_USER_AUTHENTICATION,
  ENABLE_OTP,
  LOCAL_DATA_LOADED,
  SAVE_SUBSCRIPTION_CODE,
  SET_ACCOUNT_TYPE,
  SET_PASSWORD_LEAKED,
  USER_AUTHENTICATION_FAILED,
} from "Session/Store/account/actions";
import { PersistData } from "Session/types";
export enum OtpType {
  NO_OTP = 0,
  OTP_NEW_DEVICE = 1,
  OTP_LOGIN = 2,
}
export interface Account {
  login: string;
  isAuthenticated: boolean;
  sessionStartTime: number;
  persistData: PersistData;
  otpType: OtpType;
  isPasswordLeaked: boolean;
  accountAuthenticationType: AccountAuthenticationType;
}
export function getEmptyAccount(): Account {
  return {
    login: null,
    isAuthenticated: false,
    sessionStartTime: null,
    persistData: null,
    otpType: OtpType.NO_OTP,
    isPasswordLeaked: false,
    accountAuthenticationType: "masterPassword",
  };
}
export default (state = getEmptyAccount(), action: Action) => {
  switch (action.type) {
    case OPEN_SESSION:
      return {
        ...state,
        login: action.login,
      };
    case DEVICE_REGISTERED:
    case LOCAL_DATA_LOADED:
      return {
        ...state,
        persistData: action.persistData,
      };
    case CONFIRM_USER_AUTHENTICATION:
      return {
        ...state,
        isAuthenticated: true,
        sessionStartTime: action.sessionStartTime,
      };
    case USER_AUTHENTICATION_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        sessionStartTime: null,
      };
    case ENABLE_OTP:
      return {
        ...state,
        otpType: action.otpType,
      };
    case SAVE_SUBSCRIPTION_CODE:
      return {
        ...state,
        subscriptionCode: action.code,
      };
    case SET_PASSWORD_LEAKED:
      return {
        ...state,
        isPasswordLeaked: action.isPasswordLeaked,
      };
    case SET_ACCOUNT_TYPE: {
      return {
        ...state,
        accountAuthenticationType: action.accountAuthenticationType,
      };
    }
    default:
      return state;
  }
};
