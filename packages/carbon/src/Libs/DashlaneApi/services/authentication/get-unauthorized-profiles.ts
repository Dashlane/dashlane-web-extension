import type {
  GetUnauthorizedProfilesBodyData,
  GetUnauthorizedProfilesPayload,
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
export type GetUnauthorizedProfilesRequest = GetUnauthorizedProfilesPayload;
export type GetUnauthorizedProfilesSuccess = GetUnauthorizedProfilesBodyData;
export type GetUnauthorizedProfilesResponse =
  ApiResponse<GetUnauthorizedProfilesSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "GetUnauthorizedProfiles",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getUnauthorizedProfiles(
  storeService: StoreService,
  params: GetUnauthorizedProfilesRequest
): Promise<GetUnauthorizedProfilesResponse> {
  return makeRequest<
    GetUnauthorizedProfilesRequest,
    GetUnauthorizedProfilesSuccess
  >(storeService, { payload: params });
}
