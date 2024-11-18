import {
  AuthenticationCode,
  ComputePlanPricingErrorType,
  ComputePlanPricingRequest,
  ComputePlanPricingResponse,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { isApiError } from "Libs/DashlaneApi";
import { computePlanPricingRequest } from "Libs/DashlaneApi/services/teams/compute-plan-pricing";
import { userLoginSelector } from "Session/selectors";
export async function computePlanPricing(
  services: CoreServices,
  request: ComputePlanPricingRequest
): Promise<ComputePlanPricingResponse> {
  const { storeService } = services;
  const login = userLoginSelector(storeService.getState());
  if (!login) {
    throw new Error(AuthenticationCode[AuthenticationCode.USER_UNAUTHORIZED]);
  }
  const requestResponse = await computePlanPricingRequest(
    storeService,
    login,
    request.seats
  );
  if (isApiError(requestResponse)) {
    return {
      success: false,
      error: {
        code: ComputePlanPricingErrorType.ComputePlanPricingFailed,
        message: `Compute Plan Pricing failed: ${requestResponse.message}`,
      },
    };
  }
  const { additionalSeats, renewal } = requestResponse;
  if (typeof additionalSeats === "string") {
    return {
      success: false,
      error: {
        code: ComputePlanPricingErrorType.ComputePlanPricingFailed,
        message: `Compute Plan Pricing failed for additional seat: ${additionalSeats}`,
      },
    };
  }
  if (typeof renewal === "string") {
    return {
      success: false,
      error: {
        code: ComputePlanPricingErrorType.ComputePlanPricingFailed,
        message: `Compute Plan Pricing failed for renewal: ${renewal}`,
      },
    };
  }
  return {
    success: true,
    data: {
      additionalSeats,
      renewal,
    },
  };
}
