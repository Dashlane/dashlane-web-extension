import type {
  RequestWebauthnRegistrationBodyData,
  RequestWebauthnRegistrationPayload,
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
export type RequestWebauthnRegistrationSuccess =
  RequestWebauthnRegistrationBodyData;
export type RequestWebauthnRegistrationResponse =
  ApiResponse<RequestWebauthnRegistrationSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RequestWebauthnRegistration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function requestWebauthnRegistration(
  storeService: StoreService,
  login: string
): Promise<RequestWebauthnRegistrationResponse> {
  return makeRequest<
    RequestWebauthnRegistrationPayload,
    RequestWebauthnRegistrationSuccess
  >(storeService, { login, payload: {} });
}
