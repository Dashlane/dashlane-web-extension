import {
  DeactivateWebAuthnAuthenticatorBodyData,
  DeactivateWebAuthnAuthenticatorBodyError,
  DeactivateWebAuthnAuthenticatorPayload,
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
export type DeactivateWebAuthnAuthenticatorRequest =
  DeactivateWebAuthnAuthenticatorPayload;
export type DeactivateWebAuthnAuthenticatorError =
  DeactivateWebAuthnAuthenticatorBodyError;
export type DeactivateWebAuthnAuthenticatorSuccess =
  DeactivateWebAuthnAuthenticatorBodyData;
export type DeactivateWebAuthnAuthenticatorResponse = ApiResponse<
  DeactivateWebAuthnAuthenticatorSuccess,
  DeactivateWebAuthnAuthenticatorError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateWebAuthnAuthenticator",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function deactivateWebAuthnAuthenticator(
  storeService: StoreService,
  login: string,
  params: DeactivateWebAuthnAuthenticatorRequest
): Promise<DeactivateWebAuthnAuthenticatorResponse> {
  return makeRequest<
    DeactivateWebAuthnAuthenticatorRequest,
    DeactivateWebAuthnAuthenticatorSuccess,
    DeactivateWebAuthnAuthenticatorError
  >(storeService, { login, payload: params });
}
