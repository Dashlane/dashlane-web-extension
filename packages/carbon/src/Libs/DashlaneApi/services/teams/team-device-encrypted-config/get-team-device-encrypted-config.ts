import type {
  GetTeamDeviceEncryptedConfigurationBodyData,
  GetTeamDeviceEncryptedConfigurationBodyError,
  GetTeamDeviceEncryptedConfigurationPayload,
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
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetTeamDeviceEncryptedConfiguration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type GetTeamDeviceEncryptedConfigRequest =
  GetTeamDeviceEncryptedConfigurationPayload;
export type GetTeamDeviceEncryptedConfigSuccess =
  GetTeamDeviceEncryptedConfigurationBodyData;
export type GetTeamDeviceEncryptedConfigError =
  GetTeamDeviceEncryptedConfigurationBodyError;
export type GetTeamDeviceEncryptedConfigResponse = ApiResponse<
  GetTeamDeviceEncryptedConfigSuccess,
  GetTeamDeviceEncryptedConfigError
>;
export const getTeamDeviceEncryptedConfig = (
  storeService: StoreService,
  login: string,
  payload: GetTeamDeviceEncryptedConfigRequest
): Promise<GetTeamDeviceEncryptedConfigResponse> => {
  return makeRequest<
    GetTeamDeviceEncryptedConfigRequest,
    GetTeamDeviceEncryptedConfigSuccess,
    GetTeamDeviceEncryptedConfigError
  >(storeService, { login, payload });
};
