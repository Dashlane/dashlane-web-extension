import type {
  GetHashesBodyData,
  GetHashesPayload,
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
export type GetHashesRequest = GetHashesPayload;
export type GetHashesSuccess = GetHashesBodyData;
export type GetHashesResponse = ApiResponse<GetHashesSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.pwleak,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "GetHashes",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getHashes(
  storeService: StoreService,
  params: GetHashesRequest
): Promise<GetHashesResponse> {
  return makeRequest<GetHashesRequest, GetHashesSuccess>(storeService, {
    payload: params,
  });
}
