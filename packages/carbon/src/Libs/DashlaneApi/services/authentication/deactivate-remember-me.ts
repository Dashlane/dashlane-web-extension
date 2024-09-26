import type {
  DeactivateRememberMeBodyData,
  DeactivateRememberMeBodyError,
  DeactivateRememberMePayload,
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
export type DeactivateRememberMeRequest = DeactivateRememberMePayload;
export type DeactivateRememberMeError = DeactivateRememberMeBodyError;
export type DeactivateRememberMeSuccess = DeactivateRememberMeBodyData;
export type DeactivateRememberMeResponse = ApiResponse<
  DeactivateRememberMeSuccess,
  DeactivateRememberMeError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateRememberMe",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function deactivateRememberMe(
  storeService: StoreService,
  login: string,
  params: DeactivateRememberMeRequest
): Promise<DeactivateRememberMeResponse> {
  return makeRequest<
    DeactivateRememberMeRequest,
    DeactivateRememberMeSuccess,
    DeactivateRememberMeError
  >(storeService, { login, payload: params });
}
