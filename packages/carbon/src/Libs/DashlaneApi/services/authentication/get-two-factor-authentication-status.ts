import type {
  Get2FaStatusBodyData,
  Get2FaStatusPayload,
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
export type TwoFactorAuthenticationRequest = Get2FaStatusPayload;
export type TwoFactorAuthenticationSuccess = Get2FaStatusBodyData;
export type TwoFactorAuthenticationResponse =
  ApiResponse<TwoFactorAuthenticationSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "Get2FAStatus",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function getTwoFactorAuthenticationStatus(
  storeService: StoreService,
  login: string
): Promise<TwoFactorAuthenticationResponse> {
  return makeRequest<
    TwoFactorAuthenticationRequest,
    TwoFactorAuthenticationSuccess
  >(storeService, {
    login,
    payload: {},
  });
}
