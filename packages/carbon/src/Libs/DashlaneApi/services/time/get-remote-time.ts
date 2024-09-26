import type {
  GetRemoteTimeBodyData,
  GetRemoteTimePayload,
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
export type GetRemoteTimeSuccess = GetRemoteTimeBodyData;
export type GetRemoteTimeResponse = ApiResponse<GetRemoteTimeSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.time,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.None,
  endpoint: "GetRemoteTime",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
type GetRemoteTimeRequest = GetRemoteTimePayload;
export async function getRemoteTime(
  storeService: StoreService,
  request?: GetRemoteTimeRequest
): Promise<GetRemoteTimeResponse> {
  return makeRequest<GetRemoteTimeRequest, GetRemoteTimeSuccess>(storeService, {
    payload: request ?? {},
  });
}
