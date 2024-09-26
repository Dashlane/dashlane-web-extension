import type {
  PerformTotpVerificationBodyData,
  PerformTotpVerificationBodyError,
  PerformTotpVerificationPayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
export type PerformTotpVerificationRequest = PerformTotpVerificationPayload;
export type PerformTotpVerificationSuccess = PerformTotpVerificationBodyData;
export type PerformTotpVerificationError = PerformTotpVerificationBodyError;
export type PerformTotpVerificationResponse = ApiResponse<
  PerformTotpVerificationSuccess,
  PerformTotpVerificationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "PerformTotpVerification",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function performTotpVerification(
  storeService: StoreService,
  params: PerformTotpVerificationRequest
): Promise<PerformTotpVerificationResponse> {
  return makeRequest<
    PerformTotpVerificationRequest,
    PerformTotpVerificationSuccess,
    PerformTotpVerificationError
  >(storeService, { payload: params });
}
