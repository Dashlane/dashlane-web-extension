import type {
  GetTeamSignUpPageBodyData,
  GetTeamSignUpPageBodyError,
  GetTeamSignUpPagePayload,
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
  authenticationType: ApiAuthType.App,
  endpoint: "GetTeamSignUpPage",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type GetInviteLinkResponse = ApiResponse<
  GetTeamSignUpPageBodyData,
  GetTeamSignUpPageBodyError
>;
export const getInviteLink = (
  storeService: StoreService,
  payload: GetTeamSignUpPagePayload
): Promise<GetInviteLinkResponse> => {
  return makeRequest<
    GetTeamSignUpPagePayload,
    GetTeamSignUpPageBodyData,
    GetTeamSignUpPageBodyError
  >(storeService, {
    payload,
  });
};
