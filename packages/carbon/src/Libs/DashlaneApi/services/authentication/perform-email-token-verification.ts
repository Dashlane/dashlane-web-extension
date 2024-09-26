import type {
  PerformEmailTokenVerificationBodyData,
  PerformEmailTokenVerificationBodyError,
  PerformEmailTokenVerificationPayload,
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
export type PerformEmailTokenVerificationRequest =
  PerformEmailTokenVerificationPayload;
export type PerformEmailTokenVerificationSuccess =
  PerformEmailTokenVerificationBodyData;
export type PerformEmailTokenVerificationError =
  PerformEmailTokenVerificationBodyError;
export type PerformEmailTokenVerificationResponse = ApiResponse<
  PerformEmailTokenVerificationSuccess,
  PerformEmailTokenVerificationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "PerformEmailTokenVerification",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function performEmailTokenVerification(
  storeService: StoreService,
  params: PerformEmailTokenVerificationRequest
): Promise<PerformEmailTokenVerificationResponse> {
  return makeRequest<
    PerformEmailTokenVerificationRequest,
    PerformEmailTokenVerificationSuccess,
    PerformEmailTokenVerificationError
  >(storeService, { payload: params });
}
