import type {
  ToggleTeamSignUpPageBodyData,
  ToggleTeamSignUpPageBodyError,
  ToggleTeamSignUpPagePayload,
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
  endpoint: "ToggleTeamSignUpPage",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type ToggleInviteLinkResponse = ApiResponse<
  ToggleTeamSignUpPageBodyData,
  ToggleTeamSignUpPageBodyError
>;
export const toggleInviteLink = (
  storeService: StoreService,
  login: string,
  payload: ToggleTeamSignUpPagePayload
): Promise<ToggleInviteLinkResponse> => {
  return makeRequest<
    ToggleTeamSignUpPagePayload,
    ToggleTeamSignUpPageBodyData,
    ToggleTeamSignUpPageBodyError
  >(storeService, {
    login,
    payload,
  });
};
