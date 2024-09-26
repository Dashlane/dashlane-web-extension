import type {
  PerformDashlaneAuthenticatorVerificationBodyData,
  PerformDashlaneAuthenticatorVerificationBodyError,
  PerformDashlaneAuthenticatorVerificationPayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import {
  BusinessError,
  VerificationTimeout,
} from "Libs/DashlaneApi/services/errors";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiError,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
export type PerformDashlaneAuthenticatorVerificationRequest =
  PerformDashlaneAuthenticatorVerificationPayload;
export type PerformDashlaneAuthenticatorVerificationSuccess =
  PerformDashlaneAuthenticatorVerificationBodyData;
export type PerformDashlaneAuthenticatorVerificationError =
  PerformDashlaneAuthenticatorVerificationBodyError;
export type PerformDashlaneAuthenticatorVerificationResponse = ApiResponse<
  PerformDashlaneAuthenticatorVerificationSuccess,
  PerformDashlaneAuthenticatorVerificationError
>;
export const verificationTimeoutError: ApiError<PerformDashlaneAuthenticatorVerificationError> =
  {
    code: VerificationTimeout,
    message: "The authentication request has timed out",
    type: BusinessError,
  };
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "PerformDashlaneAuthenticatorVerification",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function performDashlaneAuthenticatorVerification(
  storeService: StoreService,
  params: PerformDashlaneAuthenticatorVerificationRequest
): Promise<PerformDashlaneAuthenticatorVerificationResponse> {
  return makeRequest<
    PerformDashlaneAuthenticatorVerificationRequest,
    PerformDashlaneAuthenticatorVerificationSuccess,
    PerformDashlaneAuthenticatorVerificationError
  >(storeService, { payload: params });
}
