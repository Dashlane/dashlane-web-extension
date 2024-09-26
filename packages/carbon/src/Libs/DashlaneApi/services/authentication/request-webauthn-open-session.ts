import type {
  RequestWebauthnOpenSessionBodyData,
  RequestWebauthnOpenSessionPayload,
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
export type RequestWebauthnOpenSessionSuccess =
  RequestWebauthnOpenSessionBodyData;
export type RequestWebauthnOpenSessionResponse =
  ApiResponse<RequestWebauthnOpenSessionSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.Session,
  endpoint: "RequestWebauthnOpenSession",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function requestWebauthnOpenSession(
  storeService: StoreService,
  login: string
): Promise<RequestWebauthnOpenSessionResponse> {
  return makeRequest<
    RequestWebauthnOpenSessionPayload,
    RequestWebauthnOpenSessionSuccess
  >(storeService, { login, payload: {} });
}
