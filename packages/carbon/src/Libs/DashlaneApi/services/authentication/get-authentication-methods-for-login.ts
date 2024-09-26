import type {
  GetAuthenticationMethodsForLoginBodyData,
  GetAuthenticationMethodsForLoginBodyError,
  GetAuthenticationMethodsForLoginPayload,
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
type GetAuthenticationMethodsForLoginParams =
  GetAuthenticationMethodsForLoginPayload;
export type GetAuthenticationMethodsForLoginSuccess =
  GetAuthenticationMethodsForLoginBodyData;
export type GetAuthenticationMethodsForLoginError =
  GetAuthenticationMethodsForLoginBodyError;
export type GetAuthenticationMethodsForLoginResponse = ApiResponse<
  GetAuthenticationMethodsForLoginSuccess,
  GetAuthenticationMethodsForLoginError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "GetAuthenticationMethodsForLogin",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getAuthenticationMethodsForLogin(
  storeService: StoreService,
  params: GetAuthenticationMethodsForLoginParams
): Promise<GetAuthenticationMethodsForLoginResponse> {
  return makeRequest<
    GetAuthenticationMethodsForLoginParams,
    GetAuthenticationMethodsForLoginSuccess,
    GetAuthenticationMethodsForLoginError
  >(storeService, { payload: params });
}
