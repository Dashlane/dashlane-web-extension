import { LoginType } from "@dashlane/communication";
import {
  Mode,
  Reason,
  Status,
  UserAskAuthenticationEvent,
  UserLoginEvent,
  VerificationMode,
} from "@dashlane/hermes";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { logEvent } from "Logs/EventLogger/services";
import { CoreServices } from "Services";
import { OtpType } from "Session/Store/account/index";
const getVerificationMode = (
  otpType: OtpType,
  isInitial: boolean,
  isUsingAuthenticator: boolean
) => {
  switch (otpType) {
    case OtpType.NO_OTP:
      if (isInitial) {
        if (isUsingAuthenticator) {
          return VerificationMode.AuthenticatorApp;
        } else {
          return VerificationMode.EmailToken;
        }
      } else {
        return VerificationMode.None;
      }
    case OtpType.OTP_NEW_DEVICE:
      return VerificationMode.Otp1;
    case OtpType.OTP_LOGIN:
      return VerificationMode.Otp2;
    default:
      return VerificationMode.None;
  }
};
const sendAskAuthenticationLog = async (
  mode: Mode,
  coreServices: CoreServices,
  verificationMode: VerificationMode
): Promise<void> => {
  await logEvent(coreServices, {
    event: new UserAskAuthenticationEvent({
      mode,
      reason: Reason.Login,
      verificationMode,
    }),
  });
};
export const sendAskAuthenticationEventLog = sendAskAuthenticationLog.bind(
  null,
  Mode.MasterPassword
);
export const sendAskBiometricAuthenticationEventLog =
  sendAskAuthenticationLog.bind(null, Mode.Biometric);
export const sendAskSSOAuthenticationEventLog = sendAskAuthenticationLog.bind(
  null,
  Mode.Sso
);
const sendMasterPasswordLoginSuccessEventLog = async (
  services: CoreServices,
  isInitial: boolean
) => {
  const { otpType } = services.storeService.getAccountInfo();
  const { isUsingBackupCode, isUsingDashlaneAuthenticator } =
    services.storeService.getUserSession();
  const verificationMode = getVerificationMode(
    otpType,
    isInitial,
    isUsingDashlaneAuthenticator
  );
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.MasterPassword,
      status: Status.Success,
      isFirstLogin: isInitial,
      isBackupCode: isUsingBackupCode,
      verificationMode,
    }),
  });
};
const sendD2DLoginSuccessEventLog = async (
  services: CoreServices,
  isInitial: boolean
) => {
  const { otpType } = services.storeService.getAccountInfo();
  const { isUsingBackupCode, isUsingDashlaneAuthenticator } =
    services.storeService.getUserSession();
  const verificationMode = getVerificationMode(
    otpType,
    isInitial,
    isUsingDashlaneAuthenticator
  );
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.DeviceTransfer,
      status: Status.Success,
      isFirstLogin: isInitial,
      isBackupCode: isUsingBackupCode,
      verificationMode,
    }),
  });
};
const sendSsoLoginSuccessEventLog = async (
  services: CoreServices,
  isInitial: boolean
) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.Sso,
      status: Status.Success,
      isFirstLogin: isInitial,
      isBackupCode: false,
      verificationMode: VerificationMode.None,
    }),
  });
};
const sendBiometricLoginSuccessEventLog = async (services: CoreServices) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.Biometric,
      status: Status.Success,
      isFirstLogin: false,
      isBackupCode: false,
      verificationMode: VerificationMode.None,
    }),
  });
};
interface LoginSuccessEventLogProps {
  services: CoreServices;
  isInitial: boolean;
  loginType: LoginType;
}
export const sendLoginSuccessEventLog = async ({
  services,
  isInitial,
  loginType,
}: LoginSuccessEventLogProps) => {
  switch (loginType) {
    case "SSO":
      await sendSsoLoginSuccessEventLog(services, isInitial);
      break;
    case "Biometric":
      await sendBiometricLoginSuccessEventLog(services);
      break;
    case "MasterPassword":
      await sendMasterPasswordLoginSuccessEventLog(services, isInitial);
      break;
    case "DeviceToDevice":
      await sendD2DLoginSuccessEventLog(services, isInitial);
      break;
    case "Autologin":
      return;
    case "ARK":
      return;
    case "CreatedPasswordlessAccount":
      return;
    default:
      assertUnreachable(loginType);
  }
};
export const sendEmailTokenErrorLog = async (services: CoreServices) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.MasterPassword,
      status: Status.ErrorWrongOtp,
      isFirstLogin: true,
      isBackupCode: false,
      verificationMode: VerificationMode.EmailToken,
    }),
  });
};
export const sendOTPForNewDeviceErrorLog = async (
  services: CoreServices,
  isBackupCode: boolean
) => {
  const { otpType } = services.storeService.getAccountInfo();
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.MasterPassword,
      status: Status.ErrorWrongOtp,
      isFirstLogin: true,
      isBackupCode,
      verificationMode:
        otpType === OtpType.OTP_LOGIN
          ? VerificationMode.Otp2
          : VerificationMode.Otp1,
    }),
  });
};
export const sendOTPErrorLog = async (
  services: CoreServices,
  isBackupCode: boolean
) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.MasterPassword,
      status: Status.ErrorWrongOtp,
      isFirstLogin: false,
      isBackupCode,
      verificationMode: VerificationMode.Otp2,
    }),
  });
};
export const sendDashlaneAuthenticatorErrorLog = async (
  services: CoreServices
) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.MasterPassword,
      status: Status.ErrorWrongOtp,
      isFirstLogin: true,
      isBackupCode: false,
      verificationMode: VerificationMode.AuthenticatorApp,
    }),
  });
};
export const sendBiometricLoginErrorLog = async (services: CoreServices) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.Biometric,
      status: Status.ErrorUnknown,
      isFirstLogin: false,
      isBackupCode: false,
      verificationMode: VerificationMode.None,
    }),
  });
};
export const sendSsoLoginErrorLog = async (services: CoreServices) => {
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.Sso,
      status: Status.ErrorInvalidSso,
      isBackupCode: false,
      verificationMode: VerificationMode.None,
    }),
  });
};
export const sendMasterPasswordLoginErrorLog = async (
  services: CoreServices,
  isInitial: boolean
) => {
  const { otpType } = services.storeService.getAccountInfo();
  const { isUsingBackupCode, isUsingDashlaneAuthenticator } =
    services.storeService.getUserSession();
  const verificationMode = getVerificationMode(
    otpType,
    isInitial,
    isUsingDashlaneAuthenticator
  );
  await logEvent(services, {
    event: new UserLoginEvent({
      mode: Mode.MasterPassword,
      status: Status.ErrorWrongPassword,
      isFirstLogin: isInitial,
      isBackupCode: isUsingBackupCode,
      verificationMode,
    }),
  });
};
