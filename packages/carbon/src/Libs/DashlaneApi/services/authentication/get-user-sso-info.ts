import type { RequestTeamDeviceCredentials } from "@dashlane/server-sdk";
import type {
  GetUserSsoInfoBodyData,
  GetUserSsoInfoBodyError,
  GetUserSsoInfoPayload,
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
export type GetUserSSOInfoRequest = GetUserSsoInfoPayload &
  RequestTeamDeviceCredentials;
export type GetUserSSOInfoError = GetUserSsoInfoBodyError;
export type GetUserSSOInfoSuccess = GetUserSsoInfoBodyData;
export type GetUserSSOInfoResponse = ApiResponse<
  GetUserSSOInfoSuccess,
  GetUserSSOInfoError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.TeamDevice,
  endpoint: "GetUserSSOInfo",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getUserSSOInfo(
  storeService: StoreService,
  params: GetUserSSOInfoRequest
): Promise<GetUserSSOInfoResponse> {
  const { login, teamUuid, userServiceProviderKey } = params;
  return makeRequest<
    GetUserSsoInfoPayload,
    GetUserSSOInfoSuccess,
    GetUserSSOInfoError
  >(storeService, {
    login,
    teamUuid,
    payload: {
      login,
      userServiceProviderKey,
    },
  });
}
