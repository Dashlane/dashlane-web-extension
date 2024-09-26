import type {
  RegisterTeamDeviceBodyData,
  RegisterTeamDeviceBodyError,
  RegisterTeamDevicePayload,
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
export type RegisterTeamDeviceSuccess = RegisterTeamDeviceBodyData;
export type RegisterTeamDeviceResponse = ApiResponse<
  RegisterTeamDeviceSuccess,
  RegisterTeamDeviceBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RegisterTeamDevice",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function registerTeamDevice(
  storeService: StoreService,
  login: string,
  params: RegisterTeamDevicePayload
): Promise<RegisterTeamDeviceResponse> {
  return makeRequest<
    RegisterTeamDevicePayload,
    RegisterTeamDeviceSuccess,
    RegisterTeamDeviceBodyError
  >(storeService, { login, payload: params });
}
