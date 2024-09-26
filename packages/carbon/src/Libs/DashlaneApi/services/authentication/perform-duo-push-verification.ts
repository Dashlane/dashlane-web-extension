import type {
  PerformDuoPushVerificationBodyData,
  PerformDuoPushVerificationBodyError,
  PerformDuoPushVerificationPayload,
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
export type PerformDuoPushVerificationRequest =
  PerformDuoPushVerificationPayload;
export type PerformDuoPushVerificationSuccess =
  PerformDuoPushVerificationBodyData;
export type PerformDuoPushVerificationError =
  PerformDuoPushVerificationBodyError;
export type PerformDuoPushVerificationResponse = ApiResponse<
  PerformDuoPushVerificationSuccess,
  PerformDuoPushVerificationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "PerformDuoPushVerification",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function performDuoPushVerification(
  storeService: StoreService,
  params: PerformDuoPushVerificationRequest
): Promise<PerformDuoPushVerificationResponse> {
  return makeRequest<
    PerformDuoPushVerificationRequest,
    PerformDuoPushVerificationSuccess,
    PerformDuoPushVerificationError
  >(storeService, { payload: params });
}
