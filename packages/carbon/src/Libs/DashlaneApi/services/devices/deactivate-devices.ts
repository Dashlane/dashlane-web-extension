import type {
  DeactivateDevicesBodyData,
  DeactivateDevicesBodyError,
  DeactivateDevicesPayload,
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
export type DeactivateDevicesRequest = DeactivateDevicesPayload;
export const CLIENT_DEVICES_NOT_FOUND = "CLIENT_DEVICES_NOT_FOUND";
export const PAIRING_GROUPS_NOT_FOUND = "PAIRING_GROUPS_NOT_FOUND";
export const CLIENT_STILL_OVERFLOWING = "CLIENT_STILL_OVERFLOWING";
export type DeactivateDevicesError = DeactivateDevicesBodyError;
export type DeactivateDevicesResponse = ApiResponse<
  DeactivateDevicesBodyData,
  DeactivateDevicesError
>;
const endpointConfig = {
  group: ApiEndpointGroups.devices,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateDevices",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function deactivateDevices(
  storeService: StoreService,
  login: string,
  params: DeactivateDevicesRequest
): Promise<DeactivateDevicesResponse> {
  return makeRequest<
    DeactivateDevicesRequest,
    DeactivateDevicesBodyData,
    DeactivateDevicesError
  >(storeService, {
    login,
    payload: params,
  });
}
