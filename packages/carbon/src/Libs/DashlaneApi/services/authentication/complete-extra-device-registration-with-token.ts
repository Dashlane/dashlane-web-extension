import {
  CompleteExtraDeviceRegistrationWithTokenBodyData,
  CompleteExtraDeviceRegistrationWithTokenBodyError,
  CompleteExtraDeviceRegistrationWithTokenPayload,
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
export type CompleteExtraDeviceRegistrationWithTokenRequest =
  CompleteExtraDeviceRegistrationWithTokenPayload;
export type CompleteExtraDeviceRegistrationWithTokenError =
  CompleteExtraDeviceRegistrationWithTokenBodyError;
export type CompleteExtraDeviceRegistrationWithTokenResponse = ApiResponse<
  CompleteExtraDeviceRegistrationWithTokenBodyData,
  CompleteExtraDeviceRegistrationWithTokenError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "CompleteExtraDeviceRegistrationWithToken",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeExtraDeviceRegistrationWithToken(
  storeService: StoreService,
  params: CompleteExtraDeviceRegistrationWithTokenRequest
): Promise<CompleteExtraDeviceRegistrationWithTokenResponse> {
  return makeRequest<
    CompleteExtraDeviceRegistrationWithTokenRequest,
    CompleteExtraDeviceRegistrationWithTokenBodyData,
    CompleteExtraDeviceRegistrationWithTokenError
  >(storeService, { payload: params });
}
