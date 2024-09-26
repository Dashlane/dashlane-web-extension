import type {
  CompleteTotpActivationBodyData,
  CompleteTotpActivationBodyError,
  CompleteTotpActivationPayload,
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
export type CompleteTotpActivationRequest = CompleteTotpActivationPayload;
export type CompleteTotpActivationSuccess = CompleteTotpActivationBodyData;
export type CompleteTotpActivationError = CompleteTotpActivationBodyError;
export type CompleteTotpActivationResponse = ApiResponse<
  CompleteTotpActivationSuccess,
  CompleteTotpActivationError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "CompleteTOTPActivation",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeTotpActivation(
  storeService: StoreService,
  login: string,
  params: CompleteTotpActivationRequest
): Promise<CompleteTotpActivationResponse> {
  return makeRequest<
    CompleteTotpActivationRequest,
    CompleteTotpActivationSuccess,
    CompleteTotpActivationError
  >(storeService, { login, payload: params });
}
