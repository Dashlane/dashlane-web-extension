import type {
  GetWebAuthnAuthenticatorsBodyData,
  GetWebAuthnAuthenticatorsPayload,
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
export type GetWebAuthnAuthenticatorSuccess = GetWebAuthnAuthenticatorsBodyData;
export type GetWebAuthnAuthenticatorResponse =
  ApiResponse<GetWebAuthnAuthenticatorSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetWebAuthnAuthenticators",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getWebAuthnAuthenticators(
  storeService: StoreService,
  login: string
): Promise<GetWebAuthnAuthenticatorResponse> {
  return makeRequest<
    GetWebAuthnAuthenticatorsPayload,
    GetWebAuthnAuthenticatorSuccess
  >(storeService, { login, payload: {} });
}
