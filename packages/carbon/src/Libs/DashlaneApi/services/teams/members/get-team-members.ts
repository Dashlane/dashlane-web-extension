import type {
  GetTeamMembersBodyData,
  GetTeamMembersBodyError,
  GetTeamMembersPayload,
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
export type GetTeamMembersSuccess = GetTeamMembersBodyData;
export type GetTeamMembersError = GetTeamMembersBodyError;
export type GetTeamMembersResponse = ApiResponse<
  GetTeamMembersSuccess,
  GetTeamMembersError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetTeamMembers",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
type GetTeamMembersRequest = GetTeamMembersPayload;
export function getTeamMembers(
  storeService: StoreService,
  login: string,
  params: GetTeamMembersRequest
): Promise<GetTeamMembersResponse> {
  return makeRequest<
    GetTeamMembersRequest,
    GetTeamMembersSuccess,
    GetTeamMembersError
  >(storeService, { login, payload: params });
}
