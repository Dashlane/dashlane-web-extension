import type {
  RequestEmailTokenVerificationBodyData,
  RequestEmailTokenVerificationBodyError,
  RequestEmailTokenVerificationPayload,
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
export type RequestEmailTokenVerificationParams =
  RequestEmailTokenVerificationPayload;
export type RequestEmailTokenVerificationSuccess =
  RequestEmailTokenVerificationBodyData;
export type RequestEmailTokenVerificationError =
  RequestEmailTokenVerificationBodyError;
export type RequestEmailTokenVerificationResponse = ApiResponse<
  RequestEmailTokenVerificationSuccess,
  RequestEmailTokenVerificationError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "RequestEmailTokenVerification",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function requestEmailTokenVerification(
  storeService: StoreService,
  params: RequestEmailTokenVerificationParams
): Promise<RequestEmailTokenVerificationResponse> {
  return makeRequest<
    RequestEmailTokenVerificationParams,
    RequestEmailTokenVerificationSuccess,
    RequestEmailTokenVerificationError
  >(storeService, { payload: params });
}
