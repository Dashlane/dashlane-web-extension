import type {
  UpdateTeamDeviceEncryptedConfigurationBodyData,
  UpdateTeamDeviceEncryptedConfigurationBodyError,
  UpdateTeamDeviceEncryptedConfigurationPayload,
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
  endpoint: "UpdateTeamDeviceEncryptedConfiguration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type UpdateTeamDeviceConfigRequest =
  UpdateTeamDeviceEncryptedConfigurationPayload;
export type UpdateTeamDeviceEncryptedConfigSuccess =
  UpdateTeamDeviceEncryptedConfigurationBodyData;
export type UpdateTeamDeviceEncryptedConfigResponse = ApiResponse<
  UpdateTeamDeviceEncryptedConfigSuccess,
  UpdateTeamDeviceEncryptedConfigurationBodyError
>;
export const updateTeamDeviceEncryptedConfig = (
  storeService: StoreService,
  login: string,
  params: UpdateTeamDeviceConfigRequest
): Promise<UpdateTeamDeviceEncryptedConfigResponse> => {
  return makeRequest<
    UpdateTeamDeviceConfigRequest,
    UpdateTeamDeviceEncryptedConfigSuccess,
    UpdateTeamDeviceEncryptedConfigurationBodyError
  >(storeService, { login, payload: params });
};
