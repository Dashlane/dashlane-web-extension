import type {
  GetTeamDeviceBodyData,
  GetTeamDeviceBodyError,
  GetTeamDevicePayload,
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
export type GetTeamDeviceSuccess = GetTeamDeviceBodyData;
export type GetTeamDeviceResponse = ApiResponse<
  GetTeamDeviceSuccess,
  GetTeamDeviceBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetTeamDevice",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getTeamDevice(
  storeService: StoreService,
  login: string,
  params: GetTeamDevicePayload
): Promise<GetTeamDeviceResponse> {
  return await makeRequest<
    GetTeamDevicePayload,
    GetTeamDeviceSuccess,
    GetTeamDeviceBodyError
  >(storeService, { login, payload: params });
}
