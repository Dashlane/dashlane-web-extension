import type {
  DeactivateTeamDeviceBodyData,
  DeactivateTeamDeviceBodyError,
  DeactivateTeamDevicePayload,
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
export type DeactivateTeamDeviceSuccess = DeactivateTeamDeviceBodyData;
export type DeactivateTeamDeviceResponse = ApiResponse<
  DeactivateTeamDeviceSuccess,
  DeactivateTeamDeviceBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateTeamDevice",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type DeactivateTeamDeviceRequest = DeactivateTeamDevicePayload;
export function deactivateTeamDevice(
  storeService: StoreService,
  login: string,
  params: DeactivateTeamDeviceRequest
): Promise<DeactivateTeamDeviceResponse> {
  return makeRequest<
    DeactivateTeamDeviceRequest,
    DeactivateTeamDeviceSuccess,
    DeactivateTeamDeviceBodyError
  >(storeService, { login, payload: params });
}
