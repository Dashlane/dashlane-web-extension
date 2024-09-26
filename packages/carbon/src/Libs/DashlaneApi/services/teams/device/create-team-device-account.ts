import type {
  CreateTeamDeviceAccountBodyData,
  CreateTeamDeviceAccountBodyError,
  CreateTeamDeviceAccountPayload,
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
export type CreateTeamDeviceAccountSuccess = CreateTeamDeviceAccountBodyData;
export type CreateTeamDeviceAccountError = CreateTeamDeviceAccountBodyError;
export type CreateTeamDeviceAccountResponse = ApiResponse<
  CreateTeamDeviceAccountSuccess,
  CreateTeamDeviceAccountError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "CreateTeamDeviceAccount",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type CreateTeamDeviceAccountRequest = CreateTeamDeviceAccountPayload;
export const createTeamDeviceAccount = (
  storeService: StoreService,
  login: string,
  params: CreateTeamDeviceAccountRequest
): Promise<CreateTeamDeviceAccountResponse> => {
  return makeRequest<
    CreateTeamDeviceAccountPayload,
    CreateTeamDeviceAccountSuccess,
    CreateTeamDeviceAccountError
  >(storeService, { login, payload: params });
};
