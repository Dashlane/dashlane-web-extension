import type {
  DeactivateTotpBodyData,
  DeactivateTotpBodyError,
  DeactivateTotpPayload,
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
export type DeactivateTotpRequest = DeactivateTotpPayload;
export type DeactivateTotpSuccess = DeactivateTotpBodyData;
export type DeactivateTotpError = DeactivateTotpBodyError;
export type DeactivateTotpResponse = ApiResponse<
  DeactivateTotpSuccess,
  DeactivateTotpError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateTOTP",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function deactivateTotpVerification(
  storeService: StoreService,
  login: string,
  params: DeactivateTotpRequest
): Promise<DeactivateTotpResponse> {
  return makeRequest<
    DeactivateTotpRequest,
    DeactivateTotpSuccess,
    DeactivateTotpError
  >(storeService, { login, payload: params });
}
