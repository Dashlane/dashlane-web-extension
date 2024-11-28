import { device } from "@dashlane/browser-utils";
import { carbonConnector } from "../../carbonConnector";
export const updateLoginStepInfoLogin = (login: string): void => {
  void carbonConnector.updateLoginStepInfo({ login });
};
export const sendLogin = (params: { login: string }): void => {
  const { login } = params;
  carbonConnector.updateLoginStepInfo({ login });
  carbonConnector.openSession({
    login,
    password: undefined,
  });
};
export const sendPassword = (params: {
  login: string;
  password: string;
  rememberMe?: boolean;
}): void => {
  const { login, password, rememberMe } = params;
  carbonConnector.updateLoginStepInfo({ login });
  carbonConnector.openSessionWithMasterPassword({
    login,
    password,
    rememberPassword: rememberMe,
    loginType: "MasterPassword",
  });
};
export const sendOTP2 = (params: {
  login: string;
  otp: string;
  withBackupCode?: boolean;
}): void => {
  const { login, otp, withBackupCode } = params;
  carbonConnector.updateLoginStepInfo({ login });
  carbonConnector.openSessionWithOTP({
    login,
    otp,
    password: null,
    withBackupCode,
  });
};
export const sendOtpForNewDevice = (params: {
  login: string;
  otp: string;
  withBackupCode?: boolean;
}): void => {
  const { login, otp, withBackupCode } = params;
  carbonConnector.updateLoginStepInfo({ login });
  carbonConnector.openSessionWithOTPForNewDevice({
    login,
    otp,
    deviceName: device.getDefaultDeviceName(),
    persistData: true,
    password: null,
    withBackupCode,
  });
};
export const sendToken = (params: { login: string; token: string }): void => {
  const { login, token } = params;
  carbonConnector.updateLoginStepInfo({ login });
  carbonConnector.openSessionWithToken({
    login,
    token,
    deviceName: device.getDefaultDeviceName(),
    persistData: true,
    password: null,
  });
};
export const resendToken = (params: { login: string }): void => {
  const { login } = params;
  carbonConnector.updateLoginStepInfo({ login });
  carbonConnector.openSessionResendToken({
    login: params.login,
  });
};
export enum EmailError {
  INVALID_LOGIN = "INVALID_LOGIN",
  USER_DOESNT_EXIST = "USER_DOESNT_EXIST",
  USER_DOESNT_EXIST_SSO = "USER_DOESNT_EXIST_SSO",
  USER_DOESNT_EXIST_UNLIKELY_MX = "USER_DOESNT_EXIST_UNLIKELY_MX",
  USER_DOESNT_EXIST_INVALID_MX = "USER_DOESNT_EXIST_INVALID_MX",
  SSO_BLOCKED = "SSO_BLOCKED",
  TEAM_GENERIC_ERROR = "TEAM_GENERIC_ERROR",
}
export enum TokenError {
  TOKEN_NOT_VALID = "TOKEN_NOT_VALID",
  TOKEN_LOCKED = "TOKEN_LOCKED",
  TOKEN_TOO_MANY_ATTEMPTS = "TOKEN_TOO_MANY_ATTEMPTS",
  TOKEN_ACCOUNT_LOCKED = "TOKEN_ACCOUNT_LOCKED",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
}
export const isInTokenError = (errorCode: string): errorCode is TokenError =>
  errorCode in TokenError && !!TokenError[errorCode as keyof typeof TokenError];
export const isInEmailError = (errorCode: string): errorCode is EmailError =>
  errorCode in EmailError && !!EmailError[errorCode as keyof typeof EmailError];
