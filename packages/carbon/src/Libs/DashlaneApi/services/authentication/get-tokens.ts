import { GetTokensBodyData } from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export type GetTokensSuccess = GetTokensBodyData;
export type GetTokensResponse = ApiResponse<GetTokensSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.GET,
  authenticationType: ApiAuthType.App,
  endpoint: "GetTokens",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getTokens(storeService: StoreService) {
  return makeRequest<GetTokensSuccess>(storeService);
}
