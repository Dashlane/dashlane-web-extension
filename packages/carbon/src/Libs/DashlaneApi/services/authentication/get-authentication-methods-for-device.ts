import type {
  GetAuthenticationMethodsForDeviceBodyData,
  GetAuthenticationMethodsForDeviceBodyError,
  GetAuthenticationMethodsForDevicePayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiError,
  ApiRequestMethod,
  ApiSuccess,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
export type GetAuthenticationMethodsForDeviceParams =
  GetAuthenticationMethodsForDevicePayload;
export type GetAuthenticationMethodsForDeviceSuccess =
  GetAuthenticationMethodsForDeviceBodyData;
export type GetAuthenticationMethodsForDeviceError =
  GetAuthenticationMethodsForDeviceBodyError;
export type GetAuthenticationMethodsForDeviceResponse =
  | ApiSuccess<GetAuthenticationMethodsForDeviceSuccess>
  | ApiError<GetAuthenticationMethodsForDeviceError>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "GetAuthenticationMethodsForDevice",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getAuthenticationMethodsForDevice(
  storeService: StoreService,
  params: GetAuthenticationMethodsForDeviceParams
): Promise<GetAuthenticationMethodsForDeviceResponse> {
  return makeRequest<
    GetAuthenticationMethodsForDeviceParams,
    GetAuthenticationMethodsForDeviceSuccess,
    GetAuthenticationMethodsForDeviceError
  >(storeService, { payload: params });
}
