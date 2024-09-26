import type {
  GetU2FDevicesBodyData,
  GetU2FDevicesPayload,
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
export type GetU2FDevicesRequest = GetU2FDevicesPayload;
export type GetU2FDevicesResponseSuccess = GetU2FDevicesBodyData;
export type GetU2FDevicesResponse = ApiResponse<GetU2FDevicesResponseSuccess>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetU2FDevices",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getU2FDevices(
  storeService: StoreService,
  login: string
): Promise<GetU2FDevicesResponse> {
  return makeRequest<GetU2FDevicesRequest, GetU2FDevicesResponseSuccess>(
    storeService,
    { login, payload: {} }
  );
}
