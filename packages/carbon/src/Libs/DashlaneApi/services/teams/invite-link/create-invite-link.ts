import type {
  CreateTeamSignUpPageBodyData,
  CreateTeamSignUpPageBodyError,
  CreateTeamSignUpPagePayload,
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
  endpoint: "CreateTeamSignUpPage",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type CreateInviteLinkResponse = ApiResponse<
  CreateTeamSignUpPageBodyData,
  CreateTeamSignUpPageBodyError
>;
export const createInviteLink = (
  storeService: StoreService,
  login: string,
  payload: CreateTeamSignUpPagePayload
): Promise<CreateInviteLinkResponse> => {
  return makeRequest<
    CreateTeamSignUpPagePayload,
    CreateTeamSignUpPageBodyData,
    CreateTeamSignUpPageBodyError
  >(storeService, {
    login,
    payload,
  });
};
