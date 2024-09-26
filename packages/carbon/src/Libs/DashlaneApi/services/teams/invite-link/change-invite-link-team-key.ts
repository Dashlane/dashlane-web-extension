import type {
  ChangeTeamKeyTeamSignUpPageBodyData,
  ChangeTeamKeyTeamSignUpPageBodyError,
  ChangeTeamKeyTeamSignUpPagePayload,
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
  endpoint: "ChangeTeamKey",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type ChangeInviteLinkTeamKeyResponse = ApiResponse<
  ChangeTeamKeyTeamSignUpPageBodyData,
  ChangeTeamKeyTeamSignUpPageBodyError
>;
export const changeInviteLinkTeamKey = (
  storeService: StoreService,
  login: string
): Promise<ChangeInviteLinkTeamKeyResponse> => {
  return makeRequest<
    ChangeTeamKeyTeamSignUpPagePayload,
    ChangeTeamKeyTeamSignUpPageBodyData,
    ChangeTeamKeyTeamSignUpPageBodyError
  >(storeService, {
    login,
    payload: {},
  });
};
