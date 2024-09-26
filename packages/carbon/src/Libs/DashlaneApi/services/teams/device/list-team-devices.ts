import type {
  ListTeamDevicesBodyData,
  ListTeamDevicesBodyError,
  ListTeamDevicesPayload,
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
export type ListTeamDevicesSuccess = ListTeamDevicesBodyData;
export type ListTeamDevicesResponse = ApiResponse<
  ListTeamDevicesSuccess,
  ListTeamDevicesBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ListTeamDevices",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export const listTeamDevices = async (
  storeService: StoreService,
  login: string
): Promise<ListTeamDevicesResponse> => {
  return await makeRequest<
    ListTeamDevicesPayload,
    ListTeamDevicesSuccess,
    ListTeamDevicesBodyError
  >(storeService, { login, payload: {} });
};
