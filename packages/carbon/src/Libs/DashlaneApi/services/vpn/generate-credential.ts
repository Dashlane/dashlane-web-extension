import type {
  GetCredentialsBodyData,
  GetCredentialsBodyError,
  GetCredentialsPayload,
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
export type GetVpnCredentialRequest = GetCredentialsPayload;
export type GetVpnCredentialSuccess = GetCredentialsBodyData;
export const GetVpnCredentialBusinessErrors = {
  USER_DOESNT_HAVE_VPN_CAPABILITY: "USER_DOESNT_HAVE_VPN_CAPABILITY",
  USER_ALREADY_HAS_AN_ACCOUNT: "USER_ALREADY_HAS_AN_ACCOUNT",
  USER_ALREADY_HAS_AN_ACCOUNT_FOR_PROVIDER:
    "USER_ALREADY_HAS_AN_ACCOUNT_FOR_PROVIDER",
  USER_ALREADY_HAVE_ACTIVE_VPN_SUBSCRIPTION:
    "USER_ALREADY_HAVE_ACTIVE_VPN_SUBSCRIPTION",
};
export type GetVpnCredentialError = GetCredentialsBodyError;
export type GetVpnCredentialResponse = ApiResponse<
  GetVpnCredentialSuccess,
  GetVpnCredentialError
>;
const endpointConfig = {
  group: ApiEndpointGroups.vpn,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetCredentials",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export const generateCredential = async (
  storeService: StoreService,
  login: string,
  request: GetVpnCredentialRequest
): Promise<GetVpnCredentialResponse> => {
  return await makeRequest<
    GetVpnCredentialRequest,
    GetVpnCredentialSuccess,
    GetVpnCredentialError
  >(storeService, { login, payload: request });
};
