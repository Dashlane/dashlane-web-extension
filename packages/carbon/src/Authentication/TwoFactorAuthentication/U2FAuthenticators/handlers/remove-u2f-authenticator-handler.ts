import {
  AuthenticationCode,
  RemoveU2FAuthenticatorError,
  RemoveU2FAuthenticatorRequest,
  RemoveU2FAuthenticatorResult,
} from "@dashlane/communication";
import { HttpErrorCode } from "Libs/Http";
import { CoreServices } from "Services";
import { CarbonError, isCarbonError } from "Libs/Error";
import {
  isApiError,
  performTotpVerification,
  removeU2FAuthenticator,
} from "Libs/DashlaneApi";
import { sendExceptionLog } from "Logs/Exception";
import { userLoginSelector } from "Session/selectors";
import { handlePerformValidationError } from "Session/performValidation";
import { refreshU2FDevicesListHandler } from "Authentication/TwoFactorAuthentication/U2FAuthenticators/handlers/refresh-u2f-devices";
export const removeU2FAuthenticatorHandler = async (
  coreServices: CoreServices,
  params: RemoveU2FAuthenticatorRequest
): Promise<RemoveU2FAuthenticatorResult> => {
  try {
    const { storeService } = coreServices;
    const state = storeService.getState();
    const isUserAuthenticated = storeService.isAuthenticated;
    const login = userLoginSelector(state);
    if (!login || !isUserAuthenticated) {
      return {
        success: false,
        error: {
          code: RemoveU2FAuthenticatorError.UNKNOWN_ERROR,
        },
      };
    }
    const { authenticationCode: otp, keyHandle } = params;
    const totpVerificationResponse = await performTotpVerification(
      storeService,
      {
        login,
        otp,
      }
    );
    if (isApiError(totpVerificationResponse)) {
      return handlePerformValidationError(totpVerificationResponse, true);
    }
    const { authTicket } = totpVerificationResponse;
    const removeU2FAuthenticatorResponse = await removeU2FAuthenticator(
      storeService,
      login,
      { authTicket, keyHandle }
    );
    if (isApiError(removeU2FAuthenticatorResponse)) {
      return {
        success: false,
        error: {
          code: RemoveU2FAuthenticatorError.UNKNOWN_ERROR,
        },
      };
    }
    await refreshU2FDevicesListHandler(coreServices);
    return {
      success: true,
    };
  } catch (error) {
    const augmentedError = CarbonError.fromAnyError(error).addContextInfo(
      "U2F",
      "removeU2FAuthenticatorHandler"
    );
    sendExceptionLog({ error: augmentedError });
    return {
      success: false,
      error: {
        code:
          isCarbonError(error) &&
          error.errorCode === HttpErrorCode.NETWORK_ERROR
            ? AuthenticationCode.NETWORK_ERROR
            : RemoveU2FAuthenticatorError.UNKNOWN_ERROR,
      },
    };
  }
};
