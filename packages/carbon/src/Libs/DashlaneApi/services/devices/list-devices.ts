import type {
  ListDevicesBodyData,
  ListDevicesPayload,
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
export type ListDevicesSuccess = ListDevicesBodyData;
export type ListDevicesResponse = ApiResponse<ListDevicesSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.devices,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ListDevices",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function listDevices(
  storeService: StoreService,
  login: string
): Promise<ListDevicesResponse> {
  return makeRequest<ListDevicesPayload, ListDevicesBodyData>(storeService, {
    login,
    payload: {},
  });
}
