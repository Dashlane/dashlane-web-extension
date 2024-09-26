import type {
  PerformSsoVerificationBodyData,
  PerformSsoVerificationBodyError,
  PerformSsoVerificationPayload,
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
export type PerformSsoVerificationRequest = PerformSsoVerificationPayload;
export type PerformSsoVerificationSuccess = PerformSsoVerificationBodyData;
export type PerformSsoVerificationError = PerformSsoVerificationBodyError;
export type PerformSsoVerificationResponse = ApiResponse<
  PerformSsoVerificationSuccess,
  PerformSsoVerificationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "PerformSsoVerification",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function performSsoVerification(
  storeService: StoreService,
  params: PerformSsoVerificationRequest
): Promise<PerformSsoVerificationResponse> {
  return makeRequest<
    PerformSsoVerificationRequest,
    PerformSsoVerificationSuccess,
    PerformSsoVerificationError
  >(storeService, { payload: params });
}
