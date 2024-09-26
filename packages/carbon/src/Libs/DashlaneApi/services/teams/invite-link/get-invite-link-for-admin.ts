import type {
  GetTeamSignUpPageForAdminBodyData,
  GetTeamSignUpPageForAdminBodyError,
  GetTeamSignUpPageForAdminPayload,
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
  endpoint: "GetTeamSignUpPageForAdmin",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type GetInviteLinkForAdminResponse = ApiResponse<
  GetTeamSignUpPageForAdminBodyData,
  GetTeamSignUpPageForAdminBodyError
>;
export const getInviteLinkForAdmin = (
  storeService: StoreService,
  login: string
): Promise<GetInviteLinkForAdminResponse> => {
  return makeRequest<
    GetTeamSignUpPageForAdminPayload,
    GetTeamSignUpPageForAdminBodyData,
    GetTeamSignUpPageForAdminBodyError
  >(storeService, {
    login,
    payload: {},
  });
};
