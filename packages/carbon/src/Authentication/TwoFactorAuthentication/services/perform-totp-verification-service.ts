import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { CoreServices } from "Services";
import { isApiError, performTotpVerification } from "Libs/DashlaneApi";
import { isCarbonError } from "Libs/Error";
import { HttpErrorCode } from "Libs/Http";
import { handlePerformValidationError } from "Session/performValidation";
import { userLoginSelector } from "Session/selectors";
export const performTotpVerificationService = async (
  coreServices: CoreServices,
  authenticationCode: string,
  activationFlow = false
) => {
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
  try {
    const totpVerificationResponse = await performTotpVerification(
      storeService,
      {
        login,
        otp: authenticationCode,
        activationFlow,
      }
    );
    if (isApiError(totpVerificationResponse)) {
      return handlePerformValidationError(totpVerificationResponse, true);
    }
    const { authTicket } = totpVerificationResponse;
    return { success: true, authTicket };
  } catch (error) {
    return {
      success: false,
      error: {
        code:
          isCarbonError(error) &&
          error.errorCode === HttpErrorCode.NETWORK_ERROR
            ? AuthenticationErrorCode.NETWORK_ERROR
            : AuthenticationErrorCode.UNKNOWN_ERROR,
      },
    };
  }
};
