import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { CoreServices } from "Services";
import {
  isApiError,
  requestTOTPActivation,
  RequestTOTPActivationRequest,
} from "Libs/DashlaneApi";
import { isCarbonError } from "Libs/Error";
import { HttpErrorCode } from "Libs/Http";
import { userLoginSelector } from "Session/selectors";
export const requestTOTPActivationService = async (
  coreServices: CoreServices,
  { phoneNumber, country }: RequestTOTPActivationRequest
) => {
  try {
    const { storeService } = coreServices;
    const state = storeService.getState();
    const login = userLoginSelector(state);
    if (!login) {
      return {
        success: false,
        error: {
          code: AuthenticationErrorCode.UNKNOWN_ERROR,
        },
      };
    }
    const totpVerificationResponse = await requestTOTPActivation(
      storeService,
      login,
      {
        phoneNumber,
        country,
      }
    );
    if (isApiError(totpVerificationResponse)) {
      return {
        success: false,
        error: {
          code: totpVerificationResponse.code,
        },
      };
    }
    return { success: true, ...totpVerificationResponse };
  } catch (e) {
    return {
      success: false,
      error: {
        code:
          isCarbonError(e) && e.errorCode === HttpErrorCode.NETWORK_ERROR
            ? AuthenticationErrorCode.NETWORK_ERROR
            : AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
};
