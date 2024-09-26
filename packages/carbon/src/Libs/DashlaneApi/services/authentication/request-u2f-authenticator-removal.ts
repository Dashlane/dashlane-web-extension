import type {
  DeactivateU2FDeviceBodyData,
  DeactivateU2FDeviceBodyError,
  DeactivateU2FDevicePayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export type U2FAuthenticatorRemovalRequest = DeactivateU2FDevicePayload;
export type U2FAuthenticatorRemovalErrors = DeactivateU2FDeviceBodyError;
export type U2FAuthenticatorRemovalResponse = ApiResponse<
  DeactivateU2FDeviceBodyData,
  U2FAuthenticatorRemovalErrors
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateU2FDevice",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function removeU2FAuthenticator(
  storeService: StoreService,
  login: string,
  params: U2FAuthenticatorRemovalRequest
): Promise<U2FAuthenticatorRemovalResponse> {
  return makeRequest<
    U2FAuthenticatorRemovalRequest,
    DeactivateU2FDeviceBodyData,
    U2FAuthenticatorRemovalErrors
  >(storeService, { login, payload: params });
}
