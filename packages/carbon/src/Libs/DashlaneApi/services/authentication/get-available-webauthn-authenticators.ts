import type {
  GetAvailableWebAuthnAuthenticatorsBodyData,
  GetAvailableWebAuthnAuthenticatorsPayload,
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
export type GetAvailableWebAuthnAuthenticatorSuccess =
  GetAvailableWebAuthnAuthenticatorsBodyData;
export type GetAvailableWebAuthnAuthenticatorResponse =
  ApiResponse<GetAvailableWebAuthnAuthenticatorSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.Session,
  endpoint: "GetAvailableWebAuthnAuthenticators",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getAvailableWebAuthnAuthenticators(
  storeService: StoreService,
  login: string
): Promise<GetAvailableWebAuthnAuthenticatorResponse> {
  return makeRequest<
    GetAvailableWebAuthnAuthenticatorsPayload,
    GetAvailableWebAuthnAuthenticatorSuccess
  >(storeService, { login, payload: {} });
}
