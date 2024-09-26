import type {
  CreateTokenExtAuthBodyData,
  CreateTokenExtAuthPayload,
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
type GetAuthenticationTokenForCardUpdateSuccess = CreateTokenExtAuthBodyData;
type GetAuthenticationTokenForCardUpdateResponse =
  ApiResponse<GetAuthenticationTokenForCardUpdateSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "CreateTokenExtAuth",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function getAuthenticationTokenForCardUpdate(
  storeService: StoreService,
  login: string
): Promise<GetAuthenticationTokenForCardUpdateResponse> {
  return makeRequest<
    CreateTokenExtAuthPayload,
    GetAuthenticationTokenForCardUpdateSuccess
  >(storeService, { login, payload: {} });
}
