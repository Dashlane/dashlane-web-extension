import type {
  RequestTotpActivationBodyData,
  RequestTotpActivationBodyError,
  RequestTotpActivationPayload,
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
export type RequestTOTPActivationRequest = RequestTotpActivationPayload;
export type RequestTOTPActivationSuccess = RequestTotpActivationBodyData;
export type RequestTOTPActivationError = RequestTotpActivationBodyError;
export type RequestTOTPActivationResponse = ApiResponse<
  RequestTOTPActivationSuccess,
  RequestTOTPActivationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RequestTOTPActivation",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function requestTOTPActivation(
  storeService: StoreService,
  login: string,
  params: RequestTOTPActivationRequest
): Promise<RequestTOTPActivationResponse> {
  return makeRequest<
    RequestTOTPActivationRequest,
    RequestTOTPActivationSuccess,
    RequestTOTPActivationError
  >(storeService, { login, payload: params });
}
