import type {
  RequestExtraDeviceRegistrationBodyData,
  RequestExtraDeviceRegistrationPayload,
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
type RequestExtraDeviceRegistrationRequest =
  RequestExtraDeviceRegistrationPayload;
export type RequestExtraDeviceRegistrationSuccess =
  RequestExtraDeviceRegistrationBodyData;
export type RequestExtraDeviceRegistrationResponse =
  ApiResponse<RequestExtraDeviceRegistrationSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RequestExtraDeviceRegistration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function requestExtraDeviceRegistration(
  storeService: StoreService,
  login: string
): Promise<RequestExtraDeviceRegistrationResponse> {
  const params = { tokenType: "shortLived" } as const;
  return makeRequest<
    RequestExtraDeviceRegistrationRequest,
    RequestExtraDeviceRegistrationSuccess
  >(storeService, { login, payload: params });
}
