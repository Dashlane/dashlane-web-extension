import type {
  InitRememberMasterPasswordBodyData,
  InitRememberMasterPasswordPayload,
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
export type InitRememberMasterPasswordRequest =
  InitRememberMasterPasswordPayload;
export type InitRememberMasterPasswordSuccess =
  InitRememberMasterPasswordBodyData;
export type InitRememberMasterPasswordResponse =
  ApiResponse<InitRememberMasterPasswordSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "InitRememberMasterPassword",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function initRememberMasterPassword(
  storeService: StoreService,
  login: string,
  params: InitRememberMasterPasswordRequest
): Promise<InitRememberMasterPasswordResponse> {
  return makeRequest<
    InitRememberMasterPasswordRequest,
    InitRememberMasterPasswordSuccess
  >(storeService, { login, payload: params });
}
