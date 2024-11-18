import {
  AuthenticationCode,
  ConvertTokenToAuthTicketError,
  ConvertTokenToAuthTicketResult,
  VerificationToken,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  AccountBlockedContactSupport,
  ApiError,
  B2bSsoUserNotFound,
  BusinessError,
  FailedToContactAuthenticatorDevice,
  InvalidOTPAlreadyUsed,
  InvalidOTPBlocked,
  InvalidSsoToken,
  isApiError,
  isApiErrorOfType,
  isEmailTokenValid,
  isExtraDeviceTokenValid,
  performDashlaneAuthenticatorVerification,
  PerformDashlaneAuthenticatorVerificationError,
  performEmailTokenVerification,
  PerformEmailTokenVerificationError,
  performSsoVerification,
  PerformSsoVerificationError,
  performTotpVerification,
  PerformTotpVerificationError,
  UserHasNoActiveAuthenticator,
  VerificationFailed,
  VerificationMethodDisabled,
  VerificationRequiresRequest,
  VerificationTimeout,
  verificationTimeoutError,
} from "Libs/DashlaneApi";
export { SendTokenStatus } from "Libs/WS/Authentication";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { DashlaneAuthenticatorGetAuthTicketResult } from "Session/types";
import { StoreService } from "Store/index";
import {
  resetAuthTicketInfo,
  updateAuthTicketInfo,
} from "Session/Store/authTicket/actions";
import { updateLastMasterPasswordCheck } from "Session/Store/session/actions";
import { DataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { HttpStatusCode } from "Libs/Http/helpers";
type PerformValidationError =
  | PerformEmailTokenVerificationError
  | PerformSsoVerificationError
  | PerformTotpVerificationError
  | PerformDashlaneAuthenticatorVerificationError;
const buildAuthenticationCodeError = (
  code: AuthenticationCode,
  message?: string
): ConvertTokenToAuthTicketError => ({
  success: false,
  error: {
    code,
    message,
  },
});
export function handlePerformValidationError(
  error: ApiError<PerformValidationError>,
  otp?: boolean,
  dashlaneAuthenticator?: boolean
): ConvertTokenToAuthTicketError {
  if (!isApiErrorOfType(BusinessError, error)) {
    return buildAuthenticationCodeError(
      AuthenticationCode.REGISTER_DEVICE_FAILED
    );
  }
  const code = error.code;
  switch (code) {
    case VerificationFailed:
      if (otp) {
        return buildAuthenticationCodeError(AuthenticationCode.OTP_NOT_VALID);
      }
      if (dashlaneAuthenticator) {
        return buildAuthenticationCodeError(
          AuthenticationCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED
        );
      }
      return buildAuthenticationCodeError(AuthenticationCode.TOKEN_NOT_VALID);
    case InvalidOTPBlocked:
      return buildAuthenticationCodeError(
        AuthenticationCode.OTP_TOO_MANY_ATTEMPTS
      );
    case InvalidOTPAlreadyUsed:
      return buildAuthenticationCodeError(AuthenticationCode.OTP_ALREADY_USED);
    case AccountBlockedContactSupport:
      return buildAuthenticationCodeError(
        AuthenticationCode.TOKEN_ACCOUNT_LOCKED
      );
    case VerificationTimeout:
      return buildAuthenticationCodeError(AuthenticationCode.TOKEN_EXPIRED);
    case VerificationRequiresRequest:
      return buildAuthenticationCodeError(
        AuthenticationCode.TOKEN_TOO_MANY_ATTEMPTS
      );
    case VerificationMethodDisabled:
      return buildAuthenticationCodeError(
        AuthenticationCode.REGISTER_DEVICE_FAILED
      );
    case InvalidSsoToken:
    case B2bSsoUserNotFound:
      return buildAuthenticationCodeError(
        AuthenticationCode.SSO_VERIFICATION_FAILED
      );
    case UserHasNoActiveAuthenticator:
      return buildAuthenticationCodeError(
        AuthenticationCode.NO_ACTIVE_AUTHENTICATOR
      );
    case FailedToContactAuthenticatorDevice:
      return buildAuthenticationCodeError(
        AuthenticationCode.FAILED_TO_CONTACT_AUTHENTICATOR_DEVICE
      );
    default:
      return buildAuthenticationCodeError(
        AuthenticationCode.BUSINESS_ERROR,
        `Unexpected business_error: ${code}`
      );
  }
}
export const dashlaneAuthenticatorGetAuthTicket = async (
  storeService: StoreService,
  deviceName?: string
): Promise<DashlaneAuthenticatorGetAuthTicketResult> => {
  const { login } = storeService.getAccountInfo();
  storeService.dispatch(resetAuthTicketInfo());
  try {
    const response = await performDashlaneAuthenticatorVerification(
      storeService,
      {
        login,
        deviceName: deviceName,
      }
    );
    if (isApiError(response)) {
      return handlePerformValidationError(response, false, true);
    }
    const authTicket = response.authTicket;
    storeService.dispatch(
      updateAuthTicketInfo({
        login,
        authTicket,
        date: Date.now(),
      })
    );
    return { success: true, authTicket };
  } catch (error) {
    if (
      error.getAdditionalInfo()?.response?.status ===
      HttpStatusCode.GATEWAY_TIMEOUT
    ) {
      return handlePerformValidationError(
        verificationTimeoutError,
        false,
        true
      );
    } else {
      throw error;
    }
  }
};
export const convertTokenToAuthTicket = async (
  storeService: StoreService,
  verificationToken: VerificationToken
): Promise<ConvertTokenToAuthTicketResult> => {
  const { login } = storeService.getAccountInfo();
  storeService.dispatch(resetAuthTicketInfo());
  let authTicket;
  let response;
  switch (verificationToken.type) {
    case "emailToken": {
      if (!isEmailTokenValid(verificationToken.value)) {
        return buildAuthenticationCodeError(AuthenticationCode.TOKEN_NOT_VALID);
      }
      response = await performEmailTokenVerification(storeService, {
        login,
        token: verificationToken.value,
      });
      if (isApiError(response)) {
        return handlePerformValidationError(response);
      }
      authTicket = response.authTicket;
      break;
    }
    case "extraDeviceToken": {
      if (!isExtraDeviceTokenValid(verificationToken.value)) {
        return buildAuthenticationCodeError(AuthenticationCode.TOKEN_NOT_VALID);
      }
      return { success: true, authTicket: undefined };
    }
    case "sso": {
      if (!verificationToken.value) {
        return buildAuthenticationCodeError(AuthenticationCode.TOKEN_NOT_VALID);
      }
      response = await performSsoVerification(storeService, {
        login,
        ssoToken: verificationToken.value,
      });
      if (isApiError(response)) {
        return handlePerformValidationError(response);
      }
      authTicket = response.authTicket;
      break;
    }
    case "otp": {
      if (!verificationToken.value) {
        return buildAuthenticationCodeError(AuthenticationCode.TOKEN_NOT_VALID);
      }
      response = await performTotpVerification(storeService, {
        login,
        otp: verificationToken.value,
      });
      if (isApiError(response)) {
        return handlePerformValidationError(response, true);
      }
      authTicket = response.authTicket;
      break;
    }
    default:
      assertUnreachable(verificationToken);
  }
  storeService.dispatch(
    updateAuthTicketInfo({
      login,
      authTicket,
      date: Date.now(),
    })
  );
  return { success: true, authTicket };
};
export const validateToken = async (
  service: CoreServices,
  verificationToken: VerificationToken
) => {
  const { storeService } = service;
  return convertTokenToAuthTicket(storeService, verificationToken);
};
export const validateMasterPassword = async (
  storeService: StoreService,
  masterPasswordEncryptorService: DataEncryptorService,
  masterPassword: string
) => {
  const isValid = masterPasswordEncryptorService
    .getInstance()
    .isKey(storeService.getUserSession().serverKey, masterPassword);
  if (isValid) {
    storeService.dispatch(updateLastMasterPasswordCheck());
  }
  return isValid;
};
export const validateMasterPasswordHandler = async (
  services: CoreServices,
  masterPassword: string
) => {
  const { storeService, masterPasswordEncryptorService } = services;
  return await validateMasterPassword(
    storeService,
    masterPasswordEncryptorService,
    masterPassword
  );
};
export const resetProtectedItemAutofillTimerHandler = (
  services: CoreServices
): Promise<void> => {
  services.storeService.dispatch(updateLastMasterPasswordCheck());
  return Promise.resolve();
};
