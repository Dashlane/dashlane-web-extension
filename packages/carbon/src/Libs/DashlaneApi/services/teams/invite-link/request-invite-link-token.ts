import type {
  RequestTeamInviteTokenBodyData,
  RequestTeamInviteTokenBodyError,
  RequestTeamInviteTokenPayload,
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
  endpoint: "RequestTeamInviteToken",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type RequestInviteLinkTokenResponse = ApiResponse<
  RequestTeamInviteTokenBodyData,
  RequestTeamInviteTokenBodyError
>;
export const requestInviteLinkToken = (
  storeService: StoreService,
  payload: RequestTeamInviteTokenPayload
): Promise<RequestInviteLinkTokenResponse> => {
  return makeRequest<
    RequestTeamInviteTokenPayload,
    RequestTeamInviteTokenBodyData,
    RequestTeamInviteTokenBodyError
  >(storeService, {
    payload,
  });
};
