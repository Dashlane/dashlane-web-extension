import type {
  PerformU2FVerificationBodyData,
  PerformU2FVerificationBodyError,
  PerformU2FVerificationPayload,
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
export type PerformU2FVerificationRequest = PerformU2FVerificationPayload;
export type PerformU2FVerificationSuccess = PerformU2FVerificationBodyData;
export type PerformU2FVerificationError = PerformU2FVerificationBodyError;
export type PerformU2FVerificationResponse = ApiResponse<
  PerformU2FVerificationSuccess,
  PerformU2FVerificationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "PerformU2FVerification",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function performU2FVerification(
  storeService: StoreService,
  params: PerformU2FVerificationRequest
): Promise<PerformU2FVerificationResponse> {
  return makeRequest<
    PerformU2FVerificationRequest,
    PerformU2FVerificationSuccess,
    PerformU2FVerificationError
  >(storeService, { payload: params });
}
