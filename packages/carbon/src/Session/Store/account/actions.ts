import { AccountAuthenticationType } from "@dashlane/communication";
import { OtpType } from "Session/Store/account/";
import { PersistData } from "Session/types";
export const ENABLE_OTP = "ENABLE_OTP";
export const CONFIRM_USER_AUTHENTICATION = "CONFIRM_USER_AUTHENTICATION";
export const LOCAL_DATA_LOADED = "LOCAL_DATA_LOADED";
export const SAVE_SUBSCRIPTION_CODE = "SAVE_SUBSCRIPTION_CODE";
export const SET_PASSWORD_LEAKED = "SET_PASSWORD_LEAKED";
export const USER_AUTHENTICATION_FAILED = "USER_AUTHENTICATION_FAILED";
export const SET_ACCOUNT_TYPE = "SET_ACCOUNT_TYPE";
export const enableOtp = (otpType: OtpType) => ({
  type: ENABLE_OTP,
  otpType,
});
export const confirmUserAuthentication = () => ({
  type: CONFIRM_USER_AUTHENTICATION,
  sessionStartTime: Date.now(),
});
export const userAuthenticationFailed = () => ({
  type: USER_AUTHENTICATION_FAILED,
});
export const localDataLoaded = () => ({
  type: LOCAL_DATA_LOADED,
  persistData: PersistData.PERSIST_DATA_YES,
});
export const saveSubscriptionCode = (code: string) => ({
  type: SAVE_SUBSCRIPTION_CODE,
  code,
});
export const setPasswordLeaked = (isPasswordLeaked: boolean) => ({
  type: SET_PASSWORD_LEAKED,
  isPasswordLeaked,
});
export const storeAccountAuthenticationType = (
  accountAuthenticationType: AccountAuthenticationType
) => ({
  type: SET_ACCOUNT_TYPE,
  accountAuthenticationType,
});
