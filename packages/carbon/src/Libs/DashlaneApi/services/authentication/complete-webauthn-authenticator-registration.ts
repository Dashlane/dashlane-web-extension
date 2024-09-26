import type {
  CompleteWebAuthnAuthenticatorRegistrationBodyData,
  CompleteWebAuthnAuthenticatorRegistrationBodyError,
  CompleteWebAuthnAuthenticatorRegistrationPayload,
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
export type CompleteWebAuthnAuthenticatorRegistrationRequest =
  CompleteWebAuthnAuthenticatorRegistrationPayload;
export type CompleteWebAuthnAuthenticatorRegistrationError =
  CompleteWebAuthnAuthenticatorRegistrationBodyError;
export type CompleteWebAuthnAuthenticatorRegistrationSuccess =
  CompleteWebAuthnAuthenticatorRegistrationBodyData;
export type CompleteWebAuthnAuthenticatorRegistrationResponse = ApiResponse<
  CompleteWebAuthnAuthenticatorRegistrationSuccess,
  CompleteWebAuthnAuthenticatorRegistrationError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "CompleteWebAuthnAuthenticatorRegistration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeWebAuthnAuthenticatorRegistration(
  storeService: StoreService,
  login: string,
  params: CompleteWebAuthnAuthenticatorRegistrationRequest
): Promise<CompleteWebAuthnAuthenticatorRegistrationResponse> {
  return makeRequest<
    CompleteWebAuthnAuthenticatorRegistrationRequest,
    CompleteWebAuthnAuthenticatorRegistrationSuccess,
    CompleteWebAuthnAuthenticatorRegistrationError
  >(storeService, { login, payload: params });
}
