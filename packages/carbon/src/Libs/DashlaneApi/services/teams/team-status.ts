import type {
  TeamStatusBodyData,
  TeamStatusBodyError,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
  EmptyPayload,
} from "Libs/DashlaneApi/types";
export type TeamStatus = TeamStatusBodyData;
export type TeamStatusError = TeamStatusBodyError;
export type TeamStatusResponse = ApiResponse<TeamStatus, TeamStatusError>;
type TeamStatusSuccess = TeamStatus;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "TeamStatus",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function teamStatus(
  storeService: StoreService,
  login: string
): Promise<TeamStatusResponse> {
  return makeRequest<EmptyPayload, TeamStatusSuccess, TeamStatusError>(
    storeService,
    { login, payload: {} }
  );
}
